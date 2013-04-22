var util = require('util')
  , http = require('http')
  , fs = require('fs')
  // Variables
  , client_id = 'b45b1aa10f1ac2941910a7f0d10f8e28'
  // Utilities
  , log = function (args) { console.log(util.inspect(args, { colors: true, depth: 1 })); };

exports.getsound = null;


/**
 * Function Re-Work
 * IF song is not present inside REDIS cache, send a reply like res.send(200, 'downloadstarted');
 * Otherwise send something like res.send(200, 'cachehit');
 * So the backend can start polling for infos / use websocket in creative way to get infos about the download taking part.
 */
exports.getsound = function (req, res, next) {
  // If no param is passed, nothing to get! - TODO: change 403
  if (!req.param('url')) res.send(403);

  var scReq = http.request({
    hostname: 'api.soundcloud.com',
    path: '/resolve?client_id='+client_id+'&url='+encodeURIComponent(req.param('url'))
  }, function (scResponse) {
    var songID;

    // if the response is a redirect, that's what we want
    if (scResponse.statusCode === 302) {
      songID = scResponse.headers.location.match(/tracks\/(\d+)/)[1];
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
          },function (songDWResponse) {
            var SongWriter = fs.createWriteStream(songID+'.mp3');
            songDWResponse.pipe(SongWriter);
            songDWResponse.on('end', function() {
              res.send(200, 'download complete!');
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
      res.send(403);
    }
  });

  // Close request, don't ever forget.
  scReq.end();
};