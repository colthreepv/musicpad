var restify = require('restify'),
    bunyan = require('bunyan'),
    redis = require('redis');

var log = new bunyan({
  name: 'musicpad',
  streams: [
    {
      stream: process.stdout,
      level: 'debug'
    }
    // {
    //   path: 'restify.log',
    //   level: 'trace'
    // }
  ],
  serializers: bunyan.stdSerializers
});

var server = restify.createServer({
  name: 'musicpad',
  version: '0.0.1',
  log: log
});

global.redis = redis.createClient();

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
  req.log.debug(Date.now() - req.startedAt + 'ms');
});

// Include routes
require('./routes/')(server);

module.exports = server;
