var util = require('util')
  // Internal Libs
  , common = require('../common')
  // External Libraries
  , ytdl = require('ytdl')
  , ffmpeg = require('fluent-ffmpeg')
  // Utilities
  , log = function (args) { console.log(util.inspect(args, { colors: true })); };

exports.getvideo = null;

/**
 * ytdl library wants an URL formatted like:
 * http://www.youtube.come/watch?v=091jnasdb - KEEP THAT IN MIND!
 */
exports.getvideo = function (url, socket) {
  var ytStream = null
    , bytesGot = 0
    , videoID = url.match(/v=(.*)/)[1] // WARNING: this is *very* RAW
    , throttledConsole = common.throttle( 1000, function (bytes) {
        log(['bytes passed:', bytes]);
        socket.write(JSON.stringify({
          id: videoID,
          size: videoSize,
          progress: bytes
        }));
        bytesGot = 0;
      });

  ytStream = ytdl(url);

  // We can read a lot of infos from here, but we only get the size of the file ;
  ytStream.on('info', function (info, format) {
    videoSize = format.size;
  });
  // Pipe the ytStream to ffmpeg source
  var ffmpegProc = ffmpeg({ source: ytStream, timeout: 600 })
    .withNoVideo(true)
    .withAudioCodec('copy')
    .toFormat('ogg')
    .saveToFile('assets/youtube/'+videoID+'.ogg', function(stdout, stderr) {
    console.log('ffmpeg stdout:', stdout);
    console.log('ffmpeg stderr:', stderr);
  });

  ytStream.on('data', function (buffer) {
    bytesGot += buffer.length;
    throttledConsole(bytesGot);
  });
  ytStream.on('end', function() {
    socket.write(JSON.stringify({
      id: videoID,
      size: videoSize,
      status: 'complete'
    }));
  });
};