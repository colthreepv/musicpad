var restify = require('restify');
/**
 * Should add an array of songs to redis queue
 */

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
 */
exports.add = function (req, res, next) {
  var statusResponse = [];
};

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
