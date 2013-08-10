var fs = require('fs'),
    // Internal Libs
    common = require('./common'),
    // External libs
    async = require('async'),
    request = require('request'),
    // Variables
    maxRequests = app.get('maxRequests'),
    client_id = 'b45b1aa10f1ac2941910a7f0d10f8e28';


/**
 * Possible results
 * callback(null, true);
 * callback(null, false); NOT FOUND!
 * callback(error);
 */

/**
 * scID is a partial-url like: ascoltadi/dirk-maassen-with-science
 * statusCallback is a function that gets called *MULTIPLE* times with a JSON object as only argument
 *                it takes care of updating the user about the download process, it may be null (in future!)
 * doneCallback is a function that gets called *ONE* time only with (error, JSON) a JSON object similar to the previous
 *              function, just reporting what has been done.
 */

module.exports = function (scID, statusCallback, doneCallback) {
  // Beautiful work, we redefine statusCallback as a throttled function
  statusCallback = common.throttle(1000, true, statusCallback);

  var trueID,
      declaredFileLength, // i'm gonna read the headers, this might be different from the real length! (YEAH, SERVERS DO LIE!)
      partialBytes = 0,
      title,
      hq;

  async.waterfall([
    function (callback) {
      // From such a request we get a giant object from soundcloud API, they are damn good.
      // I'll dump an example in the proj root
      request({ url: 'https://api.soundcloud.com/resolve',
        pool: maxRequests,
        json: true,
        qs: { client_id: client_id, url: 'https://soundcloud.com/' + scID } }, callback);
    },
    function (response, body, callback) {
      // the following is just a soundcloud 404 (most probably)
      if (response.statusCode !== 200) { return callback(null, false); }

      // set globals to be returned in the _VERY_ end
      title = body.title;
      trueID = body.id;
      hq = body.downloadable;
      statusCallback({ id: trueID, status: 'starting', title: title, hq: hq, service: 'sc' });

      if (body.downloadable) {
        callback(null, request({
          url: body.download_url,
          pool: maxRequests,
          qs: { client_id: client_id }
        }));
      } else {
        callback(null, request({
          url: body.stream_url,
          pool: maxRequests,
          qs: { client_id: client_id }
        }));
      }
    },
    function (httpClientRequest, callback) {
      var songStream;
      httpClientRequest.on('response', function (httpIncomingMessage) {
        declaredFileLength = parseInt(httpIncomingMessage.headers['content-length'], 10);
        songStream = fs.createWriteStream('assets/sc/' + trueID + '.mp3');

        // piping into the file
        httpIncomingMessage.pipe(songStream);
        httpIncomingMessage.on('data', function (chunk) {
          partialBytes += chunk.length;
          statusCallback({
            id: trueID,
            status: 'progress',
            totalBytes: declaredFileLength,
            partialBytes: partialBytes,
            progress: Math.round((partialBytes / declaredFileLength) * 100)
          });
        });
      });
      httpClientRequest.on('end', function () { callback(null, declaredFileLength); });
    }
  ], function (err, results) {
    if (err) { return doneCallback(err); }
    doneCallback(null, { id: trueID, status: 'complete', title: title, hq: hq, service: 'sc' });
  });
};

exports.getsound = null;

/**
 * First socket function, this gonna be A*W*E*S*O*M*E !!!
 *
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
 **/
