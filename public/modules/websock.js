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
    triggers: {
      'blur input[name="socketData"]': 'sendData',
      'blur input[name="socketID"]': 'changeSocket'
    },
    ui: {
      transmitField: 'input[name="socketData"]',
      socketField: 'input[name="socketID"]',
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
      // Every message HAS TO BE valid JSON.
      message = JSON.parse(message.data);

      // In case it receives the intance, we can append it to the window.location
      if (message.instance) {
        self.ui.socketField.val(message.instance);
        return;
      }
      self.ui.sockethook.append('<div>'+JSON.stringify(message)+'</div>');
    };
  };

  Websock.SendData = function (args) {
    // I'll try to package a JSON and send it over the socket.
    var jsonobj = { text: this.ui.transmitField.val() };

    // Stringify && Send! Then clear the transmitField!
    this.socket.send(JSON.stringify(jsonobj));
    this.ui.transmitField.val('');
  };

  Websock.ChangeSocket = function (args) {
    console.log('issuing socket change');
    this.socket.send(JSON.stringify({
      requestID: parseInt(this.ui.socketField.val(), 10)
    }));

    // Empty the sockethook since we are listening to another channel!
    this.ui.sockethook.html('');
  };

  exports.Main = function (params) {
    var websock = new Websock.View();
    websock.on('render', Websock.BindEvents);
    websock.on('sendData', Websock.SendData);
    websock.on('changeSocket', Websock.ChangeSocket);

    App.content.show(websock);
  };
  return exports;
});