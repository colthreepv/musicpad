// Internal Libs
var soundcloud = require('./soundcloud')
  , youtube = require('./youtube');

module.exports = function (io) {

  io.sockets.on('connection', function (socket) {
    log(io);
    // socket.emit('welcome', { text: 'World!' });

  });
  // io.of('/chat').on('connection', function (socket) {
    // log('somebody connected to /chat');
  // });

};