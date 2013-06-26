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
    if (err) return doneCallback(err);
    redis.set(type+':'+id, JSON.stringify(doneStatus)); // fire and forget
    doneCallback(null, doneStatus);
  };
  redis.get(type+':'+id, function (err, reply) {
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