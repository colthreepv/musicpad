define([
    'app'
  , 'jqueryui'
],
function (App) {
  'use strict';
  var exports = {}, Login = {};

  Login.Render = function() {
    var self = this;
    // Starts spinjs & setup his demise :-)
    // self.$('.well').spin('large');
    debugger;
    self.status.always(function(){ self.$('.well').spin(false); });

    self.status.fail(function (jqXHR, textStatus, errorThrown) {
      // At the current state it can only be 200 - success, OR 403 - unauthorized
      if (jqXHR.status !== 403) return;
      self.$('.form-signin:first').hide('drop', { direction: 'down', easing: 'easeInQuart' }, function(){
        self.$('.form-signin:last').show('drop', { direction: 'up', easing: 'easeOutQuart' });
      });
    });
  };

  Login.View = Backbone.Marionette.ItemView.extend({
    initialize: function () {
      this.status = $.ajax({ method: 'GET', url: '/api/status' });
    },
    template: 'login-loading',
    triggers: {
      'submit form': 'login:submit'
    }
  });

  exports.Login = function (params) {
    var login = new Login.View();
    // Setup listeners on events
    login.on('render', Login.Render);

    App.regionMain.show(login);
    // debugger;
  };

  return exports;
});