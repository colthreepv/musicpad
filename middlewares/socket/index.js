var util = require('util')
  // Internal Libs
  , soundcloud = require('./soundcloud')
  , youtube = require('./youtube')
  // Utilities
  , log = function (args) { console.log(util.inspect(args, { colors: true })); };

module.exports = function (sockServer) {
  sockServer.on('connection', function(conn) {
    // Instantiate ONE connection per each socket.
    var pubRedis = require('redis').createClient()
      , subRedis = require('redis').createClient()
      , socketID;
    // Select DB 1 on Redis
    pubRedis.on('connect', function(){
      pubRedis.select(1);
    });

    // First things first: create a socketID
    pubRedis.incr('users', function (e, generatedID) {
      socketID = generatedID;
      conn.write(JSON.stringify({
        instance: generatedID
      }));
      // log(['headers dump', conn]);

      // Socket is now listening to whatever comes from his redisChannel!
      subRedis.subscribe(socketID);
      subRedis.on('message', function (channel, message) {
        conn.write(message);
      });

      conn.on('data', function(message) {
        message = JSON.parse(message);

        // select another socketID
        if (message.requestID) {
          // Change listening channel
          subRedis.unsubscribe(socketID);
          subRedis.subscribe(message.requestID);
          // Set the new socket for reference when sending
          socketID = message.requestID;
          // Imba debug.
          return log(['swapped channel to', message.requestID]);
        }

        // If the message has a property called 'soundcloud', this is a soundcloud song!
        // So we call the uber functionzz
        if (message.soundcloud)
          return soundcloud.getsound(message.soundcloud, pubRedis, socketID);
        if (message.youtube)
          return youtube.getvideo(message.youtube, pubRedis, socketID);

        log(['message received ', message, socketID]);
        // Publishes the message to the socket channel
        pubRedis.publish(socketID, JSON.stringify(message));
      });


      conn.on('close', function() {
        pubRedis.quit();
        subRedis.quit();
        log(['closed connection ']);
      });
    });
  });
};