var util = require('util')
  , http = require('http')
  , log = function (args) { console.log(util.inspect(args, { colors: true })); };

exports.get = null;
exports.getvid = null;
exports.YTurls = null;

exports.get = function (req, res, next) {
  // write something here tnx
  res.send(200);
};

exports.getvid = function (req, res, next) {
  http.request({
    hostname: 'www.youtube.com',
    path: '/watch?v=Tnm2jirXsT4'
  },
  function(response) {
    var data;
    // Parses file to string automatially, chunk is not a Buffer!
    // WARNING: it's bad for binary data.
    response.setEncoding('utf8');
    response.on('data', function (chunk) {
      data += chunk;
    });
    response.on('end', function() {
      var n = new RegExp('"url_encoded_fmt_stream_map": ".+?",');
      // log(exports.YTurls(data));
      // for (var i = 0; i < split.length; i++) {
      //   log(data.match(n));
      // }
      // console.log('done!', data.length);
      // console.log(data.split('\n').match(n));
      res.send(exports.YTurls(data));
    });
  }).end();

};

/**
 * Youtube catch urls script :D
 * Thanks to Chrome-YouTube-Downloader Chrome Extension
 * http://mandel-design.xf.cz/Chrome-Youtube-Downloader/
 */
/** i have to http.get the youtube webpage! :) **/
exports.YTurls = function (html) {
  var n = new RegExp('"url_encoded_fmt_stream_map": ".+?",');
  var o = html.match(n)[0];
  var b = new String(n.exec(o));
  b = b.match(/"url_encoded_fmt_stream_map": "(.*?)"/);
  b = b[1].replace(/\\u([0-9]+)/g, function (e, t) {
      return decodeURIComponent("%" + parseFloat(t))
  });
  var w = new Array;
  var signature = null
    , quality = null
    , YTurls = {};
  w = b.split(",");
  for (i = 0; i < w.length; i++) {
    quality = parseInt((w[i].match(/itag=([0-9]*)&/) || w[i].match(/itag=([0-9]*)$/))[1]);
    signature = (w[i].match(/sig=(.*?)&/) || w[i].match(/sig=(.*?)$/))[1];
    w[i] = unescape((w[i].match(/url=(.*?)&/) || w[i].match(/url=(.*?)$/))[1]) + "&signature=" + signature;
    switch (quality) {
      case 5:
        YTurls['v240p'] = w[i];
        break;
      case 18:
        YTurls['v360p'] = w[i];
        break;
      case 43:
        YTurls['wm360p'] = w[i];
        break;
      case 35:
        YTurls['v480p'] = w[i];
        break;
      case 44:
        YTurls['wm480p'] = w[i];
        break;
      case 22:
        YTurls['v720p'] = w[i];
        break;
      case 45:
        YTurls['wm720p'] = w[i];
        break;
      case 37:
        YTurls['v1080p'] = w[i];
        break;
      case 38:
        YTurls['v2k'] = w[i];
        break;
    }
  }
  return YTurls;
};