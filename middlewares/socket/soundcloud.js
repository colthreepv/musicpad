var util = require('util')
  , http = require('http')
  , fs = require('fs')
  // Internal Libs
  , common = require('../common')
  // Variables
  , client_id = 'b45b1aa10f1ac2941910a7f0d10f8e28'
  // Utilities
  , log = function (args) { console.log(util.inspect(args, { colors: true })); };

exports.getsound = null;

/**
 * First socket function, this gonna be A*W*E*S*O*M*E !!!
 */
exports.getsound = function (url, pubRedis, socketID) {
  var scReq = http.request({
    hostname: 'api.soundcloud.com',
    path: '/resolve?client_id='+client_id+'&url='+encodeURIComponent(url)
  }, function (scResponse) {
    var songID
      , bytesGot = 0
      , throttledConsole = common.throttle( 1000, function (bytes, totalBytes) {
          log(['bytes passed:', bytes]);
          pubRedis.publish(socketID, JSON.stringify({
            id: songID,
            size: totalBytes,
            progress: bytes
          }));
          bytesGot = 0;
        });

    // if the response is a redirect, that's what we want
    if (scResponse.statusCode === 302) {
      songID = parseInt(scResponse.headers.location.match(/tracks\/(\d+)/)[1], 10);
      // TODO - Check on REDIS if the file it has been already downloaded.
      // IF NOT, go on.
      // ELSE, send back to res the cached file!

      // nested Request to SoundCloud API
      var songURL = http.request({
        hostname: 'api.soundcloud.com',
        path: '/i1/tracks/'+songID+'/streams?client_id='+client_id
      }, function (songURLResponse) {
        var dataToParse = '';
        songURLResponse.setEncoding('utf8');
        songURLResponse.on('data', function (chunk) {
          dataToParse += chunk;
        });
        // when songURLResponse *FINALLY* ends, we have the responseURL!
        songURLResponse.on('end', function() {
          dataToParse = JSON.parse(dataToParse);
          // res.send(dataToParse.http_mp3_128_url);
          // So we now write the file to disk!
          var songDownload = http.request({
            hostname: dataToParse.http_mp3_128_url.match(/:\/\/(.*soundcloud.com)(.*)/)[1],
            path: dataToParse.http_mp3_128_url.match(/:\/\/(.*soundcloud.com)(.*)/)[2]
          }, function (songDWResponse) {
            // This is the correct moment to fetch the headers, to read the file size!
            var totalBytes = songDWResponse.headers['content-length'];
            // Create SongWriter and BUUURN ON DISK!
            var SongWriter = fs.createWriteStream('assets/soundcloud/'+songID+'.mp3');
            songDWResponse.pipe(SongWriter);
            songDWResponse.on('data', function (buffer) {
              bytesGot += buffer.length;
              throttledConsole(bytesGot, totalBytes);
            });
            // Send the complete response
            songDWResponse.on('end', function() {
              pubRedis.publish(socketID, JSON.stringify({
                id: songID,
                size: totalBytes,
                status: 'complete'
              }));
            });
          });
          // Close request, don't ever forget.
          songDownload.end();
        });
      });
      // Close request, don't ever forget.
      songURL.end();
    } else {
      // Send an error according to RFC if the response is not a redirect
      // something like: 'unexpected response'
      // res.send(403);
      // ** Converted reply to Websocket! :-)
      pubRedis.publish(socketID, JSON.stringify({
        url: url,
        error: 'unexpected response'
      }));
    }
  });

  // Close request, don't ever forget.
  scReq.end();
};