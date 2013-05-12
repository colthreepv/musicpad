  // Internal Libs
var soundcloud = require('./soundcloud')
  // debugging
  , util = require('util')
  , log = function (args) { console.log(util.inspect(args, { colors: true })); };


module.exports = function (sockServer) {

  sockServer.on('connection', function(conn) {

    // Echo service on data sent
    conn.on('data', function(message) {
      message = JSON.parse(message);
      // If the message has a property called 'soundcloud', this is a soundcloud song!
      // So we call the uber functionzz
      if (message.soundcloud)
        return soundcloud.getsound(message.soundcloud, conn);

      log(['message received ', message]);
    });

    conn.on('close', function() {
      log(['closed connection ', conn]);
    });
  });
};