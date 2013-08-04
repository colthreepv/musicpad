// Internal Libs
var cache = require('./cache');

module.exports = function (io) {
  io.sockets.on('connection', function (socket) {
    var roomID; // reference to the roomID

    socket.on('joinPad', function (uniqueID) {
      socket.join(uniqueID);
      roomID = uniqueID;
      socket.emit('ready');
      cache.dumpPad(roomID, function (doneStatus) {
        socket.emit('response', doneStatus);
      });
    });

    socket.on('request', function (requestObj) {
      // EXAMPLE>> requestObj = { service: 'sc', id: 'some-artist/some-song' }
      // Arguments: (type, id, progressCallback, doneCallback);
      cache.songs(
        requestObj.type,
        requestObj.id,
        function (jsonStatus) {
          io.sockets.in(roomID).emit('response', jsonStatus);
        },
        function (error, doneStatus) {
          if (error) { return io.sockets.in(roomID).emit('error', { id: requestObj.id, error: error }); }
          io.sockets.in(roomID).emit('response', doneStatus);
          // Add song to the roomID, here.
          cache.pushPad(roomID, doneStatus);
        }
      );
    });
  });
  // io.of('/chat').on('connection', function (socket) {
    // log('somebody connected to /chat');
  // });

};
