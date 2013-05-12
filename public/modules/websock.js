define([
    'app'
  , 'sockjs'
],
function (App, SockJS) {
  'use strict';
  var exports = {}, Websock = {};

  Websock.View = Backbone.Marionette.ItemView.extend({
    initialize: function () {
      this.socket = new SockJS('/socket');
    },
    template: 'websock',
    triggers: {'blur input': 'sendData'},
    ui: {
      inputfield: 'input[name="socketData"]',
      header: 'h3',
      sockethook: '#sockethook'
    }
  });

  Websock.BindEvents = function() {
    var self = this;
    // On render we bind an event on socket opening
    this.socket.onopen = function() {
      self.ui.header.html('socket open ' + new Date().getTime());
    };

    this.socket.onclose = function() {
      self.ui.header.html('socket CLOSED ' + new Date().getTime());

      // Reconnect logic!
      setTimeout(function(){
        self.socket = new SockJS('/socket');
        // Recalling this function to re-bind events on the new socket
        _.bind(Websock.BindEvents, self)();
      }, 1200);
    };

    this.socket.onmessage = function (message) {
      self.ui.sockethook.append('<div>'+message.data+'</div>');
    };
  };

  Websock.SendData = function (args) {
    // I'll try to package a JSON and send it over the socket.
    var jsonobj = { soundcloud: this.ui.inputfield.val() };

    // Stringify && Send! Then clear the inputField!
    this.socket.send(JSON.stringify(jsonobj));
    this.ui.inputfield.val('');
  };

  exports.Main = function (params) {
    var websock = new Websock.View();
    websock.on('render', Websock.BindEvents);
    websock.on('sendData', Websock.SendData);

    App.content.show(websock);
  };
  return exports;
});