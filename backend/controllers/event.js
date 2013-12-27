var events = require('events'),
    util = require('util');

/**
 * This controller should start at application startup and 'digest'
 * the events dispatched via redis
 */

function Subscriber (redisClient) {
  if (!redisClient) { throw new Error('redisClient parameter is not optional'); }
  var self = this;
  redisClient.subscribe('notifications');
  redisClient.on('message', function (channel, message) {
    message = JSON.parse(message);
    self.emit(message.to, message);
  });
}
util.inherits(Subscriber, events.EventEmitter);


exports.Subscriber = Subscriber;
exports.createSubscriber = function (redisClient) {
  return new Subscriber(redisClient);
};
