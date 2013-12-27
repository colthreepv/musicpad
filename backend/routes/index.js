var token = require('../controllers/token'),
    notifications = require('../controllers/notifications');

// Here is defined the restify API
module.exports = function (server) {
  server.get('/token', token.generate);
  server.get('/notifications', token.check, notifications.updates);
};
