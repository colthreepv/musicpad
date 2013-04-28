define([
  // libs
    'backbone'
  , 'marionette'
], function (Backbone, Marionette) {
  'use strict';

  var Router = Backbone.Marionette.AppRouter.extend({
    routes: {
      '' : 'home'
    }
    , home: function (params) { require(['modules/login'], function (Home) { Home.Login(params); }); }
  });

  return new Router();
});