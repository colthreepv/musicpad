define([
  // Application.
  'app',

  // modules
  'modules/classic/index',
  'modules/facebook/index'
],
function (app, Classic, Facebook) {
  // Defining the application router, you can attach sub routers here.
  var Router = Backbone.Router.extend({
    routes: {
      '': 'index',
      '2ndpage': 'secondpage',
      'register': 'register',
      'fb/': 'fbindex',
      'fb/fbregister': 'fbregister'
    },

    // index: function() {
    //   app.useLayout('layout').render();
    // }
    index: Classic.Welcome,
    secondpage: Facebook.SecondPage,
    register: Classic.Register,
    fbindex: Facebook.Welcome,
    fbregister: Facebook.Register
  });

  return Router;
});
