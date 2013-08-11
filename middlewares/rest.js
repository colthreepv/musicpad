/**
 * Contains all the wrappers for classic REST APIs
 */

var cache = require('./cache'),
    gentoken = require('./gentoken'),
    // variables
    baseUrl = global.baseUrl;


// EXAMPLE>> /api/soundcloud?url=some-artist/some-song
exports.soundcloud = function (req, res, next) {
  cache.songs('sc', req.param('url'), log, function (err, jsonReturn) {
    if (err) { return next(err); }
    if (jsonReturn) {
      jsonReturn.urlOgg = 'http://' + baseUrl + '/download/links/' + jsonReturn.title + '.ogg';
      jsonReturn.urlMp3 = 'http://' + baseUrl + '/download/links/' + jsonReturn.title + '.mp3';
      res.send(200, jsonReturn);
    } else {
      res.send(404);
    }
  });
};

// EXAMPLE>> /api/youtube?url=jNQXAC9IVRw
exports.youtube = function (req, res, next) {
  cache.songs('yt', req.param('url'), log, function (err, jsonReturn) {
    if (err) { return next(err); }
    jsonReturn.urlOgg = 'http://' + baseUrl + '/download/links/' + jsonReturn.title + '.ogg';
    jsonReturn.urlMp3 = 'http://' + baseUrl + '/download/links/' + jsonReturn.title + '.mp3';
    res.send(200, jsonReturn);
  });
};

// EXAMPLE>> /api/gentoken
exports.gentoken = function (req, res, next) {
  // Calls the above function using res.send to an URL
  gentoken(function (err, token) {
    if (err) { return next(err); }
    res.send(token);
  });
};
