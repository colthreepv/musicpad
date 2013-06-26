/**
 * Module dependencies.
 */
var express = require('express')
  , http = require('http')
  , path = require('path')
  , util = require('util')
  // External Libraries
  , RedisStore = require('connect-redis')(express)
  , redis = require('redis').createClient();

var app = express();

// Pollute global to let me survive! :)
global.app = app;
global.log = function (args) { console.log(util.inspect(args, { colors: true })); };

app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  // app.set('views', __dirname + '/views');
  // app.set('view engine', 'jade');
  // app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('youtube you\'re my bitch'));
  app.use(express.session({ store: new RedisStore() }));
  app.use(app.router);
  // app.use(require('less-middleware')({ src: __dirname + '/public' }));
  // app.use(express.static(path.join(__dirname, 'public/dist/')));
  app.set('redis', redis);
  app.set('maxSockets', { maxSockets: 3 });
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// Include all the routes in one command.
require('./routes/')(app);
module.exports = app;