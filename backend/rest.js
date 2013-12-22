var restify = require('restify'),
    bunyan = require('bunyan'),
    redis = require('redis');

var log = new bunyan({
  name: 'musicpad',
  streams: [
    {
      stream: process.stdout,
      level: 'trace'
    }
    // {
    //   path: 'restify.log',
    //   level: 'trace'
    // }
  ],
  serializers: {
    req: bunyan.stdSerializers.req,
    res: bunyan.stdSerializers.res,
  },
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

// Include routes
require('./routes/')(server);

module.exports = server;
