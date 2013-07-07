// Internal Libs
var common = require('./common')
  // External Libraries
  , ytdl = require('ytdl')
  , ffmpeg = require('fluent-ffmpeg')
  // Variables
  , maxRequests = app.get('maxRequests');

module.exports = function (ytID, statusCallback, doneCallback) {
  statusCallback = common.throttle(1000, true, statusCallback);

  var ytStream
    , declaredFileLength
    , partialBytes = 0
    , title
    , hq
    , ffmpegProc;

  ytStream = ytdl('http://www.youtube.com/watch?v=' + ytID, {
    // filter: function (format) { log(format); return format.container === 'mp4'; },
    pool: maxRequests
  });
  ytStream.on('info', function (info, format) {
    title = info.title;
    declaredFileLength = parseInt(format.size, 10);
    hq = (format.audioBitrate > 128) ? true : false;
    statusCallback({ id: ytID, status: 'starting', title: title, hq: hq, type: 'yt' });
  });
  ytStream.on('error', doneCallback);

  ffmpegProc = ffmpeg({ source: ytStream, timeout: 600 })
    .withNoVideo(true)
    // .withAudioCodec('copy')
    .toFormat('ogg')
    .saveToFile('assets/yt/' + ytID + '.ogg');
  // var videoDump = require('fs').createWriteStream('assets/yt/' + ytID + '.mp4');
  // ytStream.pipe(videoDump);

  ytStream.on('data', function (chunk) {
    partialBytes += chunk.length;
    statusCallback({
      id: ytID,
      status: 'progress',
      totalBytes: declaredFileLength,
      partialBytes: partialBytes,
      progress: Math.round((partialBytes / declaredFileLength) * 100)
    });
  });
  ytStream.on('end', function () {
    doneCallback(null, { id: ytID, status: 'complete', title: title, hq: hq, type: 'yt' });
  });
};
