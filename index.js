var http = require('http'),
    app = require('./app');

var httpServer = http.createServer(app).listen(app.get('port'), function(){ console.log("Express server listening on port " + app.get('port')); }),
    io = require('socket.io').listen(httpServer);

io.set('log level', 2);
// Setting those variables to be used elsewhere.
app.set('io', io);
app.set('http', httpServer);

// Calling Socket.io manager with the instance as parameter
require('./middlewares/socketio')(io);
