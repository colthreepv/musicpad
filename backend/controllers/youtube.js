var fs = require('fs');
var path = require('path');
// var util = require('util');
// var events = require('events');

var ytdl = require('ytdl');
var ffmpeg = require('fluent-ffmpeg');

module.exports = function (maxRequests) {
  return function (ytID) {
    var ytStream,
        declaredFileLength,
        partialBytes = 0,
        bestFormat = null,
        title,
        hq,
        filesBitrate;

    var filterFormats = function (format, index, formatsArray) {
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


    var diskPath = path.join('../assets/', 'yt-' + ytID);
    var diskWriter = fs.createWriteStream(diskPath);

    ytStream = ytdl('http://www.youtube.com/watch?v=' + ytID, {
      filter: filterFormats,
      pool: maxRequests
    });
    ytStream.pipe(diskWriter);

    /*
    ytStream.on('info', function (info, format) {
      // Cleaning the name from *VERY* bad utf-8 characters
      title = info.title.match(/[\w\d\+\#_().]+[\s\w\d\+\#_().]+/g).join('');
      declaredFileLength = parseInt(format.size, 10);
      hq = (format.audioBitrate > 128) ? true : false;
      filesBitrate = format.audioBitrate.toString() + 'k';
      statusCallback({ id: ytID, status: 'starting', title: title, hq: hq, service: 'yt' });
    });
    ytStream.on('error', doneCallback);

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
    }); */
    return ytStream;
  };
};
