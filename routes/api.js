module.exports = function ( app ) {
  // Requires
  var util = require('util');
  // Modules
  var api = require('../middlewares/api');

  app.get('/api/status', api.statusGet);
  app.post('/api/login', api.login);
  app.post('/api/postvid', api.postvid);
  app.post('/api/vidinfo', api.vidinfo);
};