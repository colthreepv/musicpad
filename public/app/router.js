define([
  // Application.
    'app'
  // modules
  , 'modules/index'
],
function (app, Main) {
  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({
    routes: {
      '': 'index',
      'login': 'login'
    },

    // index: function() {
    //   app.useLayout('layout').render();
    // }
    index: Main.HomePage,
    login: Main.LoginPage
  });

  return Router;
});