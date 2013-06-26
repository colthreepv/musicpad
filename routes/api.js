module.exports = function ( app ) {
  // Modules
  var rest = require('../middlewares/rest');

  // app.get('/api/status', api.statusGet);
  // app.post('/api/login', api.login);
  // app.post('/api/postvid', api.postvid);
  // app.post('/api/vidinfo', api.vidinfo);
  app.get('/api/soundcloud', rest.soundcloud);
  app.get('/api/gentoken', rest.gentoken);
};