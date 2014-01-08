var events = require('events'),
    util = require('util');

/**
 * This controller should start at application startup and handle
 * the events dispatched via redis
 */

/**
 * JSON structure for messaging
 * {
 *   to: 'randomtoken',
 *   data: {} // variable content to send
 * }
 */
function Subscriber(redisClient) {
  if (!redisClient) { throw new Error('redisClient parameter is not optional'); }
  var self = this;

  // Get an *free* subscriber id
  redisClient.incr('internal:cluster:count', function (err, subscriberID) {
    if (err) { throw new Error(err); }

    // Then subscribe to such id **AND MAKE IT GLOBAL**
    global.subscriberID = parseInt(subscriberID, 10);
    redisClient.subscribe('notifications:' + subscriberID);

    // Event on notification message
    redisClient.on('message', function (channel, message) {
      message = JSON.parse(message);
      var destination = message.to;

      redis.sismember('token:' + message.to + ':cluster', subscriberID, function (err, reply) {
        if (err) { throw new Error(err); }

        // if reply is boolean true, means this *current* cluster is hosting a long-poll connection to
        // the requested tokenmember
        if (reply) {
          self.emit(destination, message.data);
        }
        // FIXME: for now there's not a permanent notification queue
      });
    });
  });
}
util.inherits(Subscriber, events.EventEmitter);


exports.Subscriber = Subscriber;
exports.createSubscriber = function (redisClient) {
  exports.subscriber = new Subscriber(redisClient);
  return exports.subscriber;
};


/**
 * Should provide notifications for the mobile app
 * This is a restify middleware that should be attached to a route
 */
exports.updates = function (req, res, next) {
  // NOTE: req.token is defined here
  // read notifications hash.
  var notificationsKey = 'notifications:' + req.token + ':list',
      notifier = exports.subscriber;

  // function to be registered on the eventManager
  function sendNotification(message) {
    res.send(message);
    return next();
  }

  redis.lrange(notificationsKey, 0, -1, function (err, reply) {
    if (err) { return next(err); }
    // reply IS an Array
    // if contains something, means we have old notifications to send, send them away!
    if (reply.length > 0) {
      // delete notifications list
      redis.del(notificationsKey);
      res.send(reply);
      return next();
    }

    // otherwise, we setup an eventListener on notifications
    notifier.on(req.token, sendNotification);
    // if connection gets closed remotely, clear the eventListener
    req.connection.on('close', function () {
      notifier.removeListener(req.token, sendNotification);
    });

  });
  //
};
