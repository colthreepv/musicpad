var events = require('events'),
    util = require('util');

/**
 * This controller should start at application startup and 'digest'
 * the events dispatched via redis
 */

function Subscriber(redisClient) {
  if (!redisClient) { throw new Error('redisClient parameter is not optional'); }
  var self = this;
  redisClient.subscribe('notifications');
  redisClient.on('message', function (channel, message) {
    message = JSON.parse(message);
    var destination = message.to;
    delete message.to;

    // Returns true if event had listeners, false otherwise.
    if (!self.emit(destination, message)) {
      // add the non-received notification to a list
      redis.rpush('notifications:' + destination + ':list', JSON.stringify(message));
      log(['message for', destination, 'queued']);
    }
  });
}
util.inherits(Subscriber, events.EventEmitter);


exports.Subscriber = Subscriber;
exports.createSubscriber = function (redisClient) {
  return new Subscriber(redisClient);
};
