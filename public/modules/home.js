define([
    'app'
  , 'jqueryui'
],
function (App) {
  'use strict';
  var exports = {}, Login = {};

  Login.Render = function() {
    var self = this;
    App.status.fail(function (jqXHR, textStatus, errorThrown) {
      // At the current state it can only be 200 - success, OR 403 - unauthorized
      if (jqXHR.status !== 403) return;
      self.$('.form-signin:first').hide('drop', { direction: 'down', easing: 'easeInQuart' }, function(){
        self.$('.form-signin:last').show('drop', { direction: 'up', easing: 'easeOutQuart' });
      });
    });
    App.status.done(function (data, textStatus, jqXHR) {
      require(['modules/start'], function (Home) {
        Home.Start();
      });
    });
  };

  Login.Submit = function (args) {
    var self = this;
    // prepare data to be submitted
    var submitdata = {
      username: self.$('input[name="username"]').val(),
      password: self.$('input[name="password"]').val()
    };
    // Attaching this to App.status cause it's the user-status that gets updated, could be useful somewhere else!
    App.status = $.ajax({ method: 'POST', url: '/api/login', data: submitdata });
    // User feedback
    self.$('button[type="submit"]').addClass('spinner');
    App.status.always(function (jqHXR, textStatus, errorThrown) { self.$('button[type="submit"]').removeClass('spinner'); });
    // on form error just provide user feedback
    App.status.fail(function (jqHXR, textStatus, errorThrown) {
      self.$('form .control-group').addClass('error');
      self.$('form input').val('');
    });
    // on form correct, redirect to main view!
    App.status.done(function (data, textStatus, jqXHR) {
      // CallbackAggregator makes sure it gets called after:
      // a) starting module gets fetched async
      // b) animation from login is done!
      var CallbackAggregator = _.after(2, function(){
        var Home = require('modules/start');
        Home.Start();
      });
      // Clever requireJS hack - 
      // we call a require, without assigning it
      // when CallbackAggregator will be run, i can refer to this module by using
      // the synchronous version of require() since i *SURELY* already loaded it!
      require(['modules/start'], CallbackAggregator);
      self.$('.form-signin:last').hide('drop', { direction: 'down', easing: 'easeInQuart' }, CallbackAggregator );
    });
  };

  Login.View = Backbone.Marionette.ItemView.extend({
    initialize: function () {
      App.status = $.ajax({ method: 'GET', url: '/api/status' });
    },
    template: 'login-loading',
    triggers: {
      'submit form': 'submit'
    }
  });

  exports.Login = function (params) {
    var login = new Login.View();
    // Setup listeners on events
    login.on('render', Login.Render);
    login.on('submit', Login.Submit);

    App.regionMain.show(login);
    // debugger;
  };

  return exports;
});