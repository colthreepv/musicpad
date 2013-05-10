define([
    'app'
  , 'sockjs'
],
function (App, SockJS) {
  'use strict';
  var exports = {}, Websock = {};

  Websock.View = Backbone.Marionette.ItemView.extend({
    initialize: function () {
      debugger;
      var socket = new SockJS('/socket');
    },
    template: 'websock',
    triggers: {}
  });

  exports.Main = function (params) {
    var websock = new Websock.View();

    App.content.show(websock);
  };
  return exports;
});