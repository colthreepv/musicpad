/**
 * Module dependencies.
 */
var express = require('express')
  , http = require('http')
  , path = require('path')
  // External Libraries
  , RedisStore = require('connect-redis')(express)
  , redis = require('redis').createClient();

var app = express();

// Pollute global with app :)
global.app = app;

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
  // app.use(express.static(path.join(__dirname, 'public')));
  app.set('redis', redis);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// Include all the routes in one command.
require('./routes/')(app);
module.exports = app;