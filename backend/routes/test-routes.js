var token = require('../controllers/token');

// Here is defined the restify API
module.exports = function (server) {
  server.get('/testauth', token.check, function (req, res, next) {
    res.send(200);
    return next();
  });
};
