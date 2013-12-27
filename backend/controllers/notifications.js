
/**
 * Should provide notifications for the mobile app
 */
exports.updates = function (req, res, next) {
  // NOTE: req.token is defined here
  // read notifications hash.
  var notificationsKey = 'notifications:' + req.token + ':list';

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
    eventMgr.on(req.token, sendNotification);
    // if connection gets closed remotely, clear the eventListener
    req.connection.on('close', function () {
      eventMgr.removeListener(req.token, sendNotification);
    });

  });
  //
};
