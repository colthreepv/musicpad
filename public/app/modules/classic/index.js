define([
  '../../app',
  '../common',
  './register'
],
function (app, Common, Register) {
  var Classic = app.module();
  // function to display the view
  Classic.Welcome = null;
  // views
  Classic.Views.Welcome = null;
  // functions
  Classic.Functions = {};

  Classic.Views.Welcome = _.extend(
    { template: 'classic/first' }
    , { afterRender: Common.Functions.DisableGreyOut }
  );

  Classic.Welcome = function() {
    app.useLayout({ template: 'layout', views: { "#content": new Backbone.View(Classic.Views.Welcome)} }).render();
  };
  Classic.Register = function() {
    // This is unnecessary since we can't get in this page without passing thru Welcome
    if (!app.layout) { app.useLayout('layout').render(); }
    app.layout.setView('#content', new Backbone.View(Register.Views.Registration)).render();
  };

  // AMD compliance
  return Classic;
});