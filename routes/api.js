module.exports = function ( app ) {
  // Requires
  var util = require('util');
  // Modules
  var api = require('../middlewares/api');

  app.get('/api/status', api.get);
  app.get('/api/getvid', api.getvid);
};