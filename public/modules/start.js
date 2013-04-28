define([
    'app'
  , 'jqueryui'
  , 'bootstrap'
],
function (App) {
  'use strict';
  var exports = {}, Start = {}, Navbar = {};

  Start.Render = function() {
    var self = this;
    // easeOutQuart to insert navbar ;)
  };

  Navbar.Render = function() {
    var self = this;
    // self.$('.navbar-inner').show('drop', { direction: 'up', easing: 'easeOutQuart' }, 1000);
  };

  Start.View = Backbone.Marionette.ItemView.extend({
    template: 'homepage'
  });
  Navbar.View = Backbone.Marionette.ItemView.extend({
    template: 'navbar'
  });

  exports.Start = function() {
    var start = new Start.View();
    var navbar = new Navbar.View();
    // Event Hooks
    navbar.on('render', Navbar.Render);

    App.content.show(start);
    App.navbar.show(navbar);
  };
  return exports;
});