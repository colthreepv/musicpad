/**
 * Synopsis
 * -------------------------------
 * If the user requests a file, that has to happen
 * 1 - redis check if there's a key there
 *     TRUE - ok reply right here
 *     FALSE - bad, let's ask for a connection
 */

// Internal libs
var soundcloud = require('./soundcloud')
  , youtube = require('./youtube')
  // global fetch
  , redis = app.get('redis');
  // , maxSockets = app.get('maxSockets');

/**
 * 
 * @type is either 'sc' or 'yt'
 * @id is the youtube/soundcloud id
 */
exports.songs = function (type, id, statusCallback, doneCallback) {
  var setterCallback = function (err, doneStatus) {
    if (err) { return doneCallback(err); }
    redis.set(type + ':' + id, JSON.stringify(doneStatus)); // fire and forget
    doneCallback(null, doneStatus);
  };
  redis.get(type + ':' + id, function (err, reply) {
    // not manage redis error here.

    if (reply) { // in cache!
      doneCallback(null, JSON.parse(reply));
    } else { // not in cache
      if (type === 'sc') {
        soundcloud(id, statusCallback, setterCallback);
      }
      if (type === 'yt') {
        youtube(id, statusCallback, setterCallback);
      }
    }
  });
};

exports.pushPad = function (roomID, doneStatus) {
  redis.lpush('pad:' + roomID, JSON.stringify(doneStatus));
};
/**
 * itemCallback gets called *per* every object in the Pad LIST.
 *              as an argument gets (doneStatus) 
 */
exports.dumpPad = function (roomID, itemCallback) {
  redis.llen('pad:' + roomID, function (err, reply) {
    if (reply) { // if the pad exists and it's a LIST with 1+ object
      redis.lrange('pad:' + roomID, 0, reply - 1, function (err, reply) {
        reply.forEach(function (song, index) {
          setTimeout(itemCallback.bind(this, JSON.parse(song)), 50 * (index + 1));
        });
      });
    }
  });
};
