define([
    '../app'
  , './homepage'
],
function (app, HomePage) {
  var Main = app.module()
    , AppLayout = null
    , AppLayoutExt = null
    , LoginLayout = null
    , InputForms = null;
  Main.HomePage = null;
  Main.LoginPage = null;

  AppLayout = {
    template: 'layout'
    // afterRender: function() {
    //   app.userstatus.done(function (data, textStatus, jqXHR) {
    //     debugger;
    //     if (data === 'unauthorized') { app.router.navigate('login', { trigger: true }); }
    //     else { $('#logged_as a').html('Admin Logged').attr('href',''); }
    //   });
    // }
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
    // , beforeRender: function() {
    //   // if /api/status returns OK means the user is already authenticated
    //   app.userstatus.done(function (data, textStatus, jqXHR) {
    //     if (data === 'OK') { app.router.navigate('', { trigger: true }); }
    //   });
    // }
  };

  Main.HomePage = function() {
    // if (!app.layout) { return app.useLayout(AppLayoutExt({ views: {'#app-container': new Backbone.Layout(HomePage.Views.Main)} })).render(); }
    // app.layout.setView('#app-container', new Backbone.Layout(HomePage.Views.Main)).render();
    app.useLayout(AppLayoutExt({ views: {'#app-container': new Backbone.Layout(HomePage.Views.Main)} })).render();
  };

  Main.LoginPage = function() {
    // if (!app.layout) { return app.useLayout( AppLayoutExt({ views: { '#app-container': new Backbone.Layout({template: 'login'}) }}) ).render(); }
    // app.layout.setView('#app-container', new Backbone.Layout({template: 'login'})).render();
    app.layout = null;
    app.useLayout(LoginLayout).render();
  };

  // AMD compliance
  return Main;
});