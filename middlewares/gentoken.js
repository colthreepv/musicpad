var crypto = require('crypto')
  // External Libs
  , async = require('async')
  // Useful things
  , redis = app.get('redis');

// Callback: function (err, token)
module.exports = function (tokenCallback) {
  /**
   * 1) Create unique id
   * 2) Check if that unique id is actually unique on redis
   * 3) IF NOT GOTO 1
   *   - ELSE
   *    SEND!
   */
  var isIDunique = false,
      uniqueID = null,
      possibleString = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
      stringLen = possibleString.length;

  async.until(
    function () { return isIDunique; },
    function (callback) {
      crypto.pseudoRandomBytes(8, function (err, buf) {
        if (err) { return callback(err); } // manage crypto errors
        uniqueID = '';
        for (var i = 0; i < buf.length; i++) {
          uniqueID += possibleString[buf[i] % stringLen];
        }
        redis.get('pad:' + uniqueID + ':exists', function (err, reply) {
          if (err) { return callback(err); } // manage redis errors
          // If the redis.get returns NULL, means there's not that key in redis, so it's unique!
          if (!reply) {
            isIDunique = true;
            redis.set('pad:' + uniqueID + ':exists', true);
          }
          return callback();
        });
      });
    },
    function (err) {
      if (err) { return tokenCallback(err); }
      tokenCallback(err, uniqueID);
    }
  );
};
