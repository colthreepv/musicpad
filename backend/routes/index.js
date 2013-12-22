var token = require('../controllers/token');
// Here is defined the restify API
module.exports = function (server) {
  server.get('/token', token.generate);
};
