/*
 * The configuration file for require.js holds all dependency declarations for
 * the application. This is the first file, that will be loaded by require.js
 * and it holds a reference to the main.js file, that starts the app itself.
 */
require.config({

  // deps holds dependencies to load as soon as require is defined.
  deps: ['main'],

  // Paths that contain the various different javascript files.
  paths: {
      backbone: 'components/backbone/backbone'
    , marionette: 'components/backbone.marionette/lib/backbone.marionette'
    , bootstrap: 'components/bootstrap/docs/assets/js/bootstrap.js'
    , jquery: 'components/jquery/jquery'
    , jqueryui: 'components/jquery-ui/ui/jquery-ui.custom'
    , lodash: 'components/lodash/lodash'
    , tpl: 'components/requirejs-tpl/tpl'
  },

  /*
   * Configure the dependencies and exports for older, traditional
   * "browser globals" scripts that do not use define() to declare the
   * dependencies and set a module value.
   */
  shim: {

    // Backbone depends on both jquery and underscore. Backbone is available
    // as the 'Backbone' object in the window namespace.
    backbone: {
      deps: ['jquery', 'lodash'],
      exports: 'Backbone'
    },
    marionette: {
      deps: ['backbone'],
      exports: 'Backbone.Marionette'
    }
  }

});