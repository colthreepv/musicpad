// Internal Libs
var common = require('./common'),
    fs = require('fs'),
    // External Libraries
    ytdl = require('ytdl'),
    ffmpeg = require('fluent-ffmpeg'),
    // Variables
    maxRequests = app.get('maxRequests');

module.exports = function (ytID, statusCallback, doneCallback) {
  statusCallback = common.throttle(1000, true, statusCallback);

  var ytStream,
      declaredFileLength,
      partialBytes = 0,
      bestFormat = null,
      title,
      hq,
      filesBitrate,
      oggProcess,
      mp3Process;

  ytStream = ytdl('http://www.youtube.com/watch?v=' + ytID, {
    filter: function (format, index, formatsArray) {
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
    },
    pool: maxRequests
  });
  ytStream.on('info', function (info, format) {
    // Cleaning the name from *VERY* bad utf-8 characters
    title = info.title.match(/[\w\d\+_:().#\[\]]+[\w\d\s\+_:().#\[\]]+/g).join('');
    declaredFileLength = parseInt(format.size, 10);
    hq = (format.audioBitrate > 128) ? true : false;
    filesBitrate = format.audioBitrate.toString() + 'k';
    statusCallback({ id: ytID, status: 'starting', title: title, hq: hq, service: 'yt' });
  });
  ytStream.on('error', doneCallback);

  oggProcess = ffmpeg({ source: ytStream, timeout: 600 })
    .withNoVideo(true)
    .withAudioCodec('libvorbis')
    .withAudioBitrate(filesBitrate)
    .toFormat('ogg')
    .saveToFile('assets/yt/ytsux' + ytID + '.ogg');
  // var videoDump = require('fs').createWriteStream('assets/yt/' + ytID + '.mp4');
  // ytStream.pipe(videoDump);
  mp3Process = ffmpeg({ source: ytStream, timeout: 600 })
    .withNoVideo(true)
    .withAudioCodec('libmp3lame')
    .withAudioBitrate(filesBitrate)
    .toFormat('mp3')
    .saveToFile('assets/yt/ytsux' + ytID + '.mp3');

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
    fs.symlink('../yt/ytsux' + ytID + '.mp3', 'assets/links/' + title + '.mp3');
    fs.symlink('../yt/ytsux' + ytID + '.ogg', 'assets/links/' + title + '.ogg');
    doneCallback(null, { id: ytID, status: 'complete', title: title, hq: hq, service: 'yt' });
  });
};
