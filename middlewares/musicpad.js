var crypto = require('crypto')
  // External Libs
  , async = require('async')
  // Useful things
  , redis = global.app.get('redis');

exports.get = function (req, res, next) {
  /**
   * 1) Create unique id
   * 2) Check if that unique id is actually unique on redis
   * 3) IF NOT GOTO 1
   *   - ELSE
   *    SEND!
   */
  var isIDunique = false
    , uniqueID = null;

  async.until(
    function(){ return isIDunique; },
    function (callback) {
      crypto.pseudoRandomBytes(8, function (err, buf) {
        if (err) return callback(err); // manage crypto errors
        uniqueID = buf.toString('hex');
        redis.get(uniqueID, function (err, reply) {
          if (err) return callback(err); // manage redis errors
          // If the redis.get returns NULL, means there's not that key in redis, so it's unique!
          if (reply === null) isIDunique = true;
          return callback();
        });
      });
    },
    function (err) {
      if (err) return res.send(500, err);
      res.send(uniqueID);
    }
  );
};