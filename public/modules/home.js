define([
    'app'
  , 'jqueryui'
],
function (App) {
  'use strict';
  var exports = {}, Login = {};

  Login.Render = function() {
    var self = this;
    self.status.fail(function (jqXHR, textStatus, errorThrown) {
      // At the current state it can only be 200 - success, OR 403 - unauthorized
      if (jqXHR.status !== 403) return;
      self.$('.form-signin:first').hide('drop', { direction: 'down', easing: 'easeInQuart' }, function(){
        self.$('.form-signin:last').show('drop', { direction: 'up', easing: 'easeOutQuart' });
      });
    });
  };

  Login.Submit = function (args) {
    var self = this;
    // prepare data to be submitted
    var submitdata = {
      username: this.$('input[name="username"]').val(),
      password: this.$('input[name="password"]').val()
    };
    // this.status => to App.status!!
    this.status = $.ajax({ method: 'POST', url: '/api/login', data: submitdata, dataType: 'JSON' });
    // User feedback
    this.$('button[type="submit"]').addClass('spinner');
    this.status.always(function (jqHXR, textStatus, errorThrown) { this.$('button[type="submit"]').removeClass('spinner'); });
    // on form error just provide user feedback
    this.status.fail(function (jqHXR, textStatus, errorThrown) {
      self.$('form control-group').addClass('error');
      self.$('form input').val('');
    });
    // on form correct, redirect to main view!
    this.status.done(function (data, textStatus, jqXHR) {
      var mainpage = require('mainpage');
      // at this point mainpage shold be a Deferred or some kind of require.js structure
      // able to hook an even onmoduleloaded! 
      self.$('.form/signin:last').hide('drop', { direction: 'down', easing: 'easeInQuart' },
        function() {
          //mainpage.onready().show!
          //var main = new Main.View();
          //App,regionMain.show(mainpage)
        });
    });
  };

  Login.View = Backbone.Marionette.ItemView.extend({
    initialize: function () {
      this.status = $.ajax({ method: 'GET', url: '/api/status' });
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