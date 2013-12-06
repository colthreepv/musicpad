/**
 * Contains all the wrappers for classic REST APIs
 */

var cache = require('./cache'),
    gentoken = require('./gentoken'),
    // variables
    baseUrl = global.baseUrl;

var scRegex = /https?:\/\/(?:www.)?soundcloud.com\/([A-Za-z0-9]+(?:[-_][A-Za-z0-9]+)*(?!\/sets(?:\/|$))(?:\/[A-Za-z0-9]+(?:[-_][A-Za-z0-9]+)*){1,2}\/?)/,
    ytRegex = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;



// EXAMPLE>> /api/soundcloud?url=some-artist/some-song
exports.soundcloud = function (req, res, next) {
  var shortURL = null,
      value = req.param('url');

  if ((shortURL = value.match(scRegex)) !== null) {
    shortURL = shortURL.pop();
  }

  res.setHeader('Content-Type', 'application/json');
  cache.songs('sc', shortURL,
    function (statusReturn) {
      statusReturn.progress = statusReturn.progress || 0;
      res.write('progress: ' + statusReturn.progress.toString() + '\n');
    },
    function (err, jsonReturn) {
      if (err) { return next(err); }
      jsonReturn.urlOgg = 'http://' + baseUrl + '/download/links/' + jsonReturn.title + '.ogg';
      jsonReturn.urlMp3 = 'http://' + baseUrl + '/download/links/' + jsonReturn.title + '.mp3';
      res.end(JSON.stringify(jsonReturn));
    });
};

// EXAMPLE>> /api/youtube?url=jNQXAC9IVRw
exports.youtube = function (req, res, next) {
  var shortURL = null,
      value = req.param('url');

  if ((shortURL = value.match(ytRegex)) !== null) {
    shortURL = shortURL.pop();
  }

  res.setHeader('Content-Type', 'application/json');
  cache.songs('yt', shortURL,
    function (statusReturn) {
      statusReturn.progress = statusReturn.progress || 0;
      res.write('progress: ' + statusReturn.progress.toString() + '\n');
    },
    function (err, jsonReturn) {
      if (err) { return next(err); }
      jsonReturn.urlOgg = 'http://' + baseUrl + '/download/links/' + jsonReturn.title + '.ogg';
      jsonReturn.urlMp3 = 'http://' + baseUrl + '/download/links/' + jsonReturn.title + '.mp3';
      res.end(JSON.stringify(jsonReturn));
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
