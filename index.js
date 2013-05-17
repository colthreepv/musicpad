var http = require('http')
  , app = require('./app')
  // debugging
  , util = require('util')
  , log = function (args) { console.log(util.inspect(args, { colors: true })); };

var httpServer = http.createServer(app).listen(app.get('port'), function(){ console.log("Express server listening on port " + app.get('port')); })
  , io = require('socket.io').listen(httpServer);

// Setting those variables to be used elsewhere.
app.set('io', io);
app.set('http', httpServer);

// Calling SockJS manager with the instance as parameter
require('./middlewares/socket/')(io);
