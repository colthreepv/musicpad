var restify = require('restify'),
    bunyan = require('bunyan'),
    redis = require('redis'),
    util = require('util'),
    notifications = require('./controllers/notifications');

global.redis = redis.createClient();
global.log = function (args, depth) { console.log(util.inspect(args, { colors: true, depth: depth })); };
// subscribe to 'notification' redis channel
global.notifications = notifications.createSubscriber(redis.createClient());

var logger = new bunyan({
  name: 'musicpad',
  streams: [
    {
      stream: process.stdout,
      level: 'debug'
    }
  ],
  serializers: bunyan.stdSerializers
});

var server = restify.createServer({
  name: 'musicpad',
  version: '0.0.1',
  log: logger
});

server.use(restify.acceptParser(server.acceptable));
// rejectUnknown: this you can set to true to end the request with a UnsupportedMediaTypeError when nonone of the supported content types was given. Defaults to false
server.use(restify.bodyParser({ rejectUnknown: true }));
server.use(restify.requestLogger());
// throttle middleware
server.use(restify.throttle({
  burst: 120,
  rate: 60,
  username: true,
  overrides: {
    '192.168.1.100': {
      rate: 0, // unlimited
      burst: 0
    }
  }
}));

// middleware to track time elapsed
server.pre(function (req, res, next) {
  req.startedAt = Date.now();
  next();
});
server.on('after', function (req, res, route, error) {
  // Note that when you are using the default 404/405/BadVersion handlers, this event will still be fired, but route will be null.
  var path = (route) ? route.spec.path : undefined,
      method = (route) ? route.spec.method : undefined;

  req.log.debug(method, path, Date.now() - req.startedAt + 'ms');
});

// Include routes
require('./routes/')(server);
if (!process.env.PRODUCTION) {
  require('./routes/test-routes')(server);
}

module.exports = server;
