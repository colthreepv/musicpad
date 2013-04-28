define([
    'app'
],
function (App) {
  'use strict';
  var exports = {}, Start = {};

  Start.View = Backbone.Marionette.ItemView.extend({
    template: 'homepage'
  });

  exports.Start = function() {
    var start = new Start.View();

    App.regionMain.show(start);
  };
  return exports;
});