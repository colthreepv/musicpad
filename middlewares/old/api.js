// Function wrapping is useless in node.js
// http://www.nearinfinity.com/blogs/jeff_kunkle/2012/06/13/secret-sauce-of-nodejs-modules.html
// NO MORE -> (function () {})();
var http = require('http')
  // Internal Libraries
  , common = require('./common')
  // External Libraries
  , ytdl = require('ytdl')
  , ffmpeg = require('fluent-ffmpeg');

exports.statusGet = null;
exports.login = null;
exports.postvid = null;
exports.vidinfo = null;

/**
 * Returns the URL for the "best" quality available
 * Some work and brainstorming TO-DO here.
 * @param {[PlainObject]} ytdl info obj
 * @returns {[string]} [Best-Effort URL] ?!?!?!?
 */
filterQuality = function (ytdl_info) {
  if (ytdl_info) {
    return ytdl_info;
  } else {
    return ytdl_info;
  }
};

exports.statusGet = function (req, res, next) {
  log(req.session);
  // Artificial delay to show the spinner on loadpage.
  // setTimeout(function(){
    if (req.session && req.session.logged) {
      res.send(200);
    } else {
      res.send(403, 'unauthorized');
    }
  // }, 1000);
};

exports.login = function (req, res, next) {
  if (typeof req.body.username === 'string' &&
   typeof req.body.password === 'string' &&
   req.body.username.trim() === 'mrgamer' &&
   req.body.password.trim() === 'let me in'
  ) {
    req.session.logged = true;
    res.send(200);
  } else {
    res.send(403);
  }
};

/**
 * postvid accepts an url as parameter
 * TEST IT WITH
 * $.ajax({type: 'POST', url: '/api/postvid', dataType: 'json', data: { url: 'XRF-QqFgMug'} }).done(function (data) { console.log(data); });
 */
exports.postvid = function (req, res, next) {
  var ytBaseurl = "http://www.youtube.come/watch?v="
    , url = req.body.url || "Tnm2jirXsT4" || null
    , ytStream = null
    , bytesGot = 0
    , throttledConsole = common.throttle( 250, function (bytesGot) {
      console.log('url data fetch:', bytesGot, 'bytes?');
      bytesGot = 0;
    });

  ytStream = ytdl(ytBaseurl+url);
  var ffmpegProc = ffmpeg({ source: ytStream })
    .withNoVideo(true)
    .withAudioCodec('copy')
    .toFormat('ogg')
    .saveToFile('./public/assets/'+url+'.ogg', function(stdout, stderr) {
    console.log('ffmpeg stdout:', stdout);
    console.log('ffmpeg stderr:', stderr);
  });

  ytStream.on('data', function (buffer) {
    bytesGot += buffer.length;
    throttledConsole(bytesGot);
  });
  ytStream.on('end', function() {
    res.send(200);
  });
};

/**
 * vidinfo accepts an url as parameter
 * TEST IT WITH
 * $.ajax({type: 'POST', url: '/api/vidinfo', dataType: 'json', data: { url: 'XRF-QqFgMug'} }).done(function (data) { console.log(data); });
 */
exports.vidinfo = function (req, res, next) {
  var ytBaseurl = "http://www.youtube.come/watch?v="
    , url = req.body.url || "Tnm2jirXsT4" || null;
  ytdl.getInfo(ytBaseurl+url, function (err, info) {
    if (err) return console.log(err);
    res.send(info);
  });
};