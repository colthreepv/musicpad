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

module.exports = function (type, id, statusCallback, doneCallback) {
  
};