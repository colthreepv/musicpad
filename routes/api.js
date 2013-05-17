module.exports = function ( app ) {
  // Requires
  var util = require('util');
  // Modules
  var api = require('../middlewares/api')
    , soundcloud = require('../middlewares/soundcloud')
    , musicpad = require('../middlewares/musicpad');

  app.get('/api/status', api.statusGet);
  app.post('/api/login', api.login);
  app.post('/api/postvid', api.postvid);
  app.post('/api/vidinfo', api.vidinfo);
  app.get('/api/soundcloud', soundcloud.getsound);
  app.get('/api/musicpad', musicpad.get);
};