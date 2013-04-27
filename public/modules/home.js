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
    // we get data
    // start ajax
    // user feedback
    // etcetc
    debugger;
    var submitdata = {
      username: this.$('input[name="username"]').val(),
      password: this.$('input[name="password"]').val()
    };
    this.status = $.ajax({ method: 'POST', url: '/api/login', data: submitdata, dataType: 'JSON' });
    // User feedback
    
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