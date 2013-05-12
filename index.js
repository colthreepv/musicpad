var http = require('http')
  , app = require('./app')
  , sockjs = require('sockjs')
  // debugging
  , util = require('util')
  , log = function (args) { console.log(util.inspect(args, { colors: true })); };

var httpServer = http.createServer(app).listen(app.get('port'), function(){ console.log("Express server listening on port " + app.get('port')); })
  , sockServer = sockjs.createServer({sockjs_url: '//cdnjs.cloudflare.com/ajax/libs/sockjs-client/0.3.4/sockjs.min.js'});

// Bind SockJS to Express HTTP server
sockServer.installHandlers(httpServer, {prefix:'/socket'});

// Calling SockJS manager with the instance as parameter
require('./middlewares/socket/')(sockServer);

// Setting those variables to be used elsewhere.
app.set('sockjs', sockServer);
app.set('http', httpServer);