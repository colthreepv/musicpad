define([
  '../../app',
  './welcome',
  './register',
  '../common'
],
function (app, Welcome, Register, Common) {
  var Facebook = app.module();
  Facebook.Welcome = null;
  Facebook.SecondPage = null;
  Facebook.Register = null;
  // Deps Injection
  // I want to keep stuff separated, mixing objects makes them BIG, that's bad.
  // _.extend(Facebook, Welcome, Common);


  // Definition by extension
  Facebook.Views.SecondPageView = _.extend(
    {template: 'facebook/secondpage'}
    , { events: { 'click #setSession': 'setSession' }}
    , { setSession: Common.Functions.setSession }
    , { afterRender: Common.Functions.DisableGreyOut }
  );

  Facebook.Welcome = function() {
    app.useLayout('layout').setViews({'#content': new Backbone.View(Welcome.Views.FirstPageView)}).render();
  };
  Facebook.SecondPage = function() {
    // If this URL is called directly, we need to build the layout first, otherwise we have
    // nothing to attach the View to!
    if (!app.layout) { app.useLayout('layout').render(); }
    app.layout.setView('#content', new Backbone.View(Facebook.Views.SecondPageView)).render();
  };
  Facebook.Register = function() {
    // This is unnecessary since we can't get in this page without passing thru Welcome
    if (!app.layout) { app.useLayout('layout').render(); }
    app.layout.setView('#content', new Backbone.View(Register.Views.Registration)).render();
  };
  
  // Facebook.QuerySession = function() {
  //   if (!app.layout) { Backbone.history.navigate('#prizes'); Facebook.Prizes(); return; }
  //   $.post('/api/status', $('input[name="session_text"]').serialize()).done(function (data) {
  //     console.log('status response:', data);
  //   });
  // };

  // AMD compliance
  return Facebook;
});