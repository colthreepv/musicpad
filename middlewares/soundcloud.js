var util = require('util')
  , http = require('http')
  // Variables
  , client_id = 'b45b1aa10f1ac2941910a7f0d10f8e28'
  // Utilities
  , log = function (args) { console.log(util.inspect(args, { colors: true, depth: 1 })); };

exports.getsound = null;

exports.getsound = function (req, res, next) {
  // If no param is passed, nothing to get! - TODO: change 403
  if (!req.param('url')) res.send(403);

  var scReq = http.request({
    hostname: 'api.soundcloud.com',
    path: '/resolve?client_id='+client_id+'&url='+encodeURIComponent(req.param('url'))
  }, function (response) {
    var songID;

    // if the response is a redirect, that's what we want
    if (response.statusCode === 302) {
      songID = response.headers.location.match(/tracks\/(\d+)/)[1];

      // nested Request to SoundCloud API
      var songURL = http.request({
        hostname: 'api.soundcloud.com',
        path: '/i1/tracks/'+songID+'/streams?client_id='+client_id
      }, function (songResponse) {
        var dataToParse = '';
        songResponse.setEncoding('utf8');
        songResponse.on('data', function (chunk) {
          dataToParse += chunk;
        });
        // when songResponse *FINALLY* ends, we have the responseURL!
        songResponse.on('end', function() {
          dataToParse = JSON.parse(dataToParse);
          res.send(dataToParse.http_mp3_128_url);
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