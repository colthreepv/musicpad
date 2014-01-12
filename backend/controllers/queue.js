var restify = require('restify'),
    async = require('async');


/**
 * Many comments to define spec!
 *
 * Client sends this:
 *
 * {
 *   queueTo: 'MyOwnMusicpad', // name of the musicpad, default is 'default'
 *   queue: [
 *     {
 *       type: 'youtube',
 *       id: 'tKi9Z-f6qX4'
 *     },
 *     {
 *       type: 'soundcloud',
 *       id: 'asd01981983nn'
 *     },
 *     {
 *       type: 'youtube',
 *       id: 'QJelsOHe6xk'
 *     }
 *   ]
 * }
 *
 *
 *
 * Download Queue Logic
 *
 * LastOperation: 1000 <- Date.now()
 * DownloadQueue: Sorted Set
 *
 * Add Song, priority (Date.now() - LastOperation) -> 5000 - 1000 = 4000
 * + Time 5000
 * LastOperation: 5400
 * ConsumedPriority: 3100 <- This is the last consumed item
 * Add Song, priority (Date.now() - ConsumedPriority) -> 10000 - 3100 = 4600
 *
 * Sorted Set:
 *
 * internal:queue:list - sorted set containing songs to dowload
 * internal:maxpriority:value - value containing the N max priority currently available (value of the most requested song)
 * internal:maxpriority:key - name to the max priority key available
 *
 * song:SONGID:exists => "{ type: 'youtube', id: '9n282nsa_sais' }"
 */


/**
 * Should add an array of songs to redis queue
 */
exports.add = function (req, res, next) {
  // Array containing status per each song requested
  var statusResponse = [],
      queue = req.params.queue;

  async.map(queue, function processItem(song, mapCallback) {
    var existsKey = 'song:' + song.id + ':exists';

    async.waterfall([
      function callRedis(callback) {
        redis.get(existsKey, callback);
      },
      function checkExists(reply, callback) {
        if (reply) { // exists
          redis.zincrby('internal:queue:list', 1, song.id, function (err, reply) { callback(err, 'queue'); });
        } else {
          redis.zadd('internal:queue:list', 1, song.id, function (err, reply) { callback(err, 'new'); });
          redis.set(existsKey, JSON.stringify(song));
        }
      }
    ], function waterfallEnds(err, redisAction) {
      var songWithStatus = song;

      // in case the song already existed, it will return status queue, otherwise saying new
      songWithStatus.status = redisAction;

      mapCallback(err, songWithStatus);
    });
  }, function mapEnds(err, results) {
    if (err) { return next(err); }

    res.send(200, results);
    return next();
  });
};


var ytdl = require('ytdl');
var waitForDownload = require('redis').createClient();
var filterFormats = function () {
  var bestFormat = null;
  return function (format, index, formatsArray) {
    if (bestFormat === null) {
      bestFormat = format;
      formatsArray.forEach(function (format, index, formatsArray) {
        if (format.audioBitrate >= bestFormat.audioBitrate &&
            parseFloat(format.bitrate) < parseFloat(bestFormat.bitrate || Infinity) &&
            (format.audioEncoding === 'vorbis' || format.audioEncoding === 'aac')) {
          bestFormat = format;
        }
      });
    }
    return format === bestFormat;
  };
};
var pool = { maxSockets: 2 };
var ytDownloader = require('./youtube')(pool);
var songDownloader = function (songID, callback) {
  log(['consumer', 'consuming', songID]);
  callback(null);
};

/**
 * This function should get the first song available in download queue
 * it queries a sorted set, if the response is something, then tries to avoid
 * racing conditions removing the key.
 * If the current process successes in removing the key, then it has to handle the download
 */
var firstSong = function (callback) {
  // zrange always returns an Array, remember!
  redis.zrange('internal:download:queue', 0, 0, function (err, song) {
    if (err) { return callback(err); }
    if (song.length) {
      redis.zrem('internal:download:queue', song, function (err, deletedBoolean) {
        if (err) { return callback(err); }
        if (deletedBoolean) {
          // Handle download.
          callback(null, song[0]);
        } else {
          // Too late, another process handled it
          callback(null, null);
        }
      });
    } else {
      // There's nothing to download
      callback(null, null);
    }
  });
};


/**
 * consumes a ready song, or listens for an event
 * FIXME: this is **incredibly** broken
 */
var consumer = function (errorHandler) {
  firstSong(function (err, song) {
    if (err) { return errorHandler(err); }

    function recallYourself() {
      waitForDownload.removeListener('message', recallYourself);
      waitForDownload.unsubscribe(function (err) {
        // Restart anew
        consumer(errorHandler);
      });
    }

    // In case the function captures a song, it will download it
    // and THEN will restart itself
    //
    // Otherwise
    // will wait for a signal, and then restart itself
    if (song) {
      songDownloader(song, function (err, result) {
        consumer(errorHandler);
      });
    } else {
      log(['consumer', 'waiting for event']);
      waitForDownload.subscribe('internal:download:event');
      waitForDownload.on('message', recallYourself);
    }
  });
};
exports.consumer = consumer;

/**
 * middleware to validate the JSON queue
 * I just want to be extra careful about bad data
 */
exports.validQueue = function (req, res, next) {

  if (
    (req.params.queueTo && typeof req.params.queueTo === 'string') &&
    (req.params.queue && typeof req.params.queue === 'object' && req.params.queue instanceof Array)
  ) {
    // in case the outer JSON is valid, filter the contents of queue JSON
    req.params.queue = req.params.queue.filter(function (item, index, array) {
      // Checks input JSON to be a valid queue
      if (item.type === 'youtube' || item.type === 'soundcloud') {
        if (item.id && item.id.length < 64) {
          return true;
        }
      }
      return false;
    });

    // return next middleware
    return next();
  }

  return next(new restify.InvalidContentError('JSON sent is not valid'));
};
