/**
 * Contains all the wrappers for classic REST APIs
 */

var soundcloud = require('./soundcloud')
  , gentoken = require('./gentoken');

// EXAMPLE>> /api/soundcloud?url=some-artist/some-song
exports.soundcloud = function (req, res, next) {
  soundcloud(req.param('url'), log, function (error, jsonReturn) {
    if (error) return next(err);
    res.send(200, jsonReturn);
  });
};

// EXAMPLE>> /api/gentoken
exports.gentoken = function (req, res, next) {
  // Calls the above function using res.send to an URL
  gentoken(function (err, token) {
    if (err) return next(err);
    res.send(token);
  });
};