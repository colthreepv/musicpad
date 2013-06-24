// Internal Libs
var musicpad = require('../musicpad')
  , soundcloud = require('./soundcloud')
  , youtube = require('./youtube');

module.exports = function (io) {
  io.sockets.on('connection', function (socket) {
    socket.on('uniqueID', function (uniqueID) {

      // this socket is a get/setter, if the client sends an uniqueID we join him to that room
      // otherwise, we generate a uniqueID an *THEN* join him to that room
      // 
      // HE MUST F*****KIN JOIN DA ROOM!
      if (!uniqueID) {
        // generate uniqueID and send it back to the user, then join it to the room
        musicpad.genToken(function (err, token) {
          if (err) return socket.emit('error', err);
          socket.emit('uniqueID', token);
        });
      } else {
        socket.join(uniqueID);
        socket.emit('ready');
      }

      log(uniqueID);
    });
    // socket.emit('welcome', { text: 'World!' });
  });
  // io.of('/chat').on('connection', function (socket) {
    // log('somebody connected to /chat');
  // });

};