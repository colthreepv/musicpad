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
      'blur input[name="socketData"]': 'socketSend',
      'keyup input[name="socketData"]': 'socketDataChange',
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

  Websock.DataChange = function (args) {
    var requestToSocket;
    // Clear statuses if the field is empty
    if (this.ui.transmitField.val() === '') return this.ui.transmitField.parents('.control-group').removeClass('info').removeClass('error');

    // Check for valid data entered
    if ( requestToSocket = Websock.RequestPrepare(this.ui.transmitField.val()) ) {
      this.ui.transmitField.parents('.control-group').removeClass('error').addClass('info');
      this.nextRequest = requestToSocket;
    } else {
      this.ui.transmitField.parents('.control-group').removeClass('info').addClass('error');
    }

  };

  Websock.sendData = function (args) {
    if (this.nextRequest) {
      this.socket.send(JSON.stringify(this.nextRequest));
      this.nextRequest = null;
      this.ui.transmitField.val('');
    }
  };

  Websock.ChangeSocket = function (args) {
    console.log('issuing socket change');
    this.socket.send(JSON.stringify({
      requestID: parseInt(this.ui.socketField.val(), 10)
    }));

    // Empty the sockethook since we are listening to another channel!
    this.ui.sockethook.html('');
  };

  Websock.RequestPrepare = function (url) {
    // Soundcloud having 2 capture groups - any useful?
    // Youtube regex supporting classic yt video and youtu.be format
    //   must be careful with that, sometimes i recall youtube videos getting called with a LOT of arguments
    //   and i don't think that regex is robust enough to filter em all.
    var scRegex = /https?\:\/\/.*?soundcloud.com\/(.*?)\/(.*)/
      , ytRegex = /https?\:\/\/.*?(?:(?:youtube.com\/watch.*?v\=(?:.*?)(?:\s|$))|(?:youtu.be\/(?:.*)))/
      , regexResult;

    // returns the purified version when it matches
    if ( regexResult = url.match(scRegex))
      return { soundcloud: regexResult[0] };

    if ( regexResult = url.match(ytRegex))
      return { youtube: regexResult[0] };

    return null;
  };

  exports.Main = function (params) {
    var websock = new Websock.View();
    websock.on('render', Websock.BindEvents);
    websock.on('socketSend', Websock.sendData);
    websock.on('socketDataChange', Websock.DataChange);
    websock.on('changeSocket', Websock.ChangeSocket);

    App.content.show(websock);
  };
  return exports;
});