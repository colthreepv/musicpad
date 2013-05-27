define([
  // libs
    'backbone'
  , 'marionette'
], function (Backbone, Marionette) {
  'use strict';

  var Router = Backbone.Marionette.AppRouter.extend({
    routes: {
      '' : 'home',
      'websock': 'websock'
    }
    , home: function (params) { require(['modules/login'], function (Home) { Home.Login(params); }); }
    , websock: function (params) { require(['modules/websock'], function (Websock) { Websock.Main(params); }); }
  });

  return new Router();
});