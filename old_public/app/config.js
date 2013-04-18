// Set the require.js configuration for your application.
require.config({

  // Initialize the application with the main application file and the JamJS
  // generated configuration file.
  deps: ['main'],

  paths: {
    // Use the underscore build of Lo-Dash to minimize incompatibilities.
    'lodash': '../vendor/lodash/dist/lodash.underscore',
    'jquery': '../vendor/jquery/jquery-1.9.1',
    'backbone': '../vendor/backbone/backbone',
    'backbone.layoutmanager': '../vendor/backbone.layoutmanager/backbone.layoutmanager',
    'underscore': '../vendor/underscore/underscore',

    // Put additional paths here.
    // Following folder is not useful for now, but maybe later.
    // plugins: '../vendor/js/plugins',
    'spinjs': '../vendor/libs/spin.min',
    'jquery.Spin': '../vendor/libs/jquery.spin',
    'facebook': '../vendor/libs/facebook',
    'bootstrap': '../vendor/bootstrap/js/bootstrap',
    'text': '../vendor/requirejs-text/text'
  },

  map: {
    // Ensure Lo-Dash is used instead of underscore.
    '*': { 'underscore': 'lodash' }

    // Put additional maps here.
  },

  shim: {
    // Put shims here.
    'bootstrap': ['jquery'],
    'jquery.Spin': { deps: ['spinjs', 'jquery'], exports: '$.fn.spin'},
    'facebook': { exports: 'FB'},
    'backbone': { deps: ['jquery', 'lodash'], exports: 'Backbone' },
    'backbone.layoutmanager': { deps: ['backbone'], exports: 'Backbone.Layout' }
  }

});
