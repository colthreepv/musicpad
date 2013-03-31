define([
  '../app',
  './common'
],
function (app, Common) {
  var Main = app.module()
    , AppLayout = null
    , AppLayoutExt = null
    , LoginLayout = null;
  Main.HomePage = null;
  Main.LoginPage = null;

  AppLayout = {
    template: 'layout',
    beforeRender: function() {
      app.userstatus.done(function (data, textStatus, jqXHR) {
        if (data === 'unauthorized') { app.router.navigate('login', { trigger: true }); }
      });
    }
  };
  AppLayoutExt = function (views_obj) {
    return _.extend(AppLayout, views_obj);
  };

  LoginLayout = {
      template: 'login'
    , events: { 'submit form': function (event) {
        event.preventDefault();
        $.ajax({ type: 'POST', url: '/api/login', data: $('form').serialize() })
          .done(function (data, textStatus, jqXHR) {
            // README: Router must not referenced, use app.router instead.
            app.router.navigate('', {trigger: true});
          })
          .fail(function (jqXHR, textStatus, errorThrown) {
            $($('.control-group')[0]).addClass('error');
            $($('.control-group')[1]).addClass('error');
          });
      }
    }
    , beforeRender: function() {
      // if /api/status returns OK means the user is already authenticated
      app.userstatus.done(function (data, textStatus, jqXHR) {
        if (data === 'OK') { app.router.navigate('', { trigger: true }); }
      });
    }
  };

  Main.HomePage = function() {
    app.useLayout(AppLayoutExt({ views: {'#app-container': new Backbone.Layout({template: 'indexpage'})} }) ).render();
    app.layout.setView('#app-container', new Backbone.Layout({template: 'indexpage'})).render();
  };

  Main.LoginPage = function() {
    // if (!app.layout) { return app.useLayout( AppLayoutExt({ views: { '#app-container': new Backbone.Layout({template: 'login'}) }}) ).render(); }
    // app.layout.setView('#app-container', new Backbone.Layout({template: 'login'})).render();
    app.useLayout(LoginLayout).render();
  };

  // AMD compliance
  return Main;
});