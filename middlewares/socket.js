  // debugging
var util = require('util')
  , log = function (args) { console.log(util.inspect(args, { colors: true })); };


module.exports = function (sockServer) {

  sockServer.on('connection', function(conn) {
      conn.on('data', function(message) {
          conn.write(message);
      });
  });
};