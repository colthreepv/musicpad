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
    , home: function (params) { require(['modules/home'], function (Home) { Home.Main(params); }); }
  });

  return new Router();
});