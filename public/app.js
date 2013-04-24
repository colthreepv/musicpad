define([
  // libs
    'jquery'
  , 'lodash'
  , 'backbone'
  , 'marionette'
],
function($, _, Backbone, Marionette) {
  'use strict';

  // The app will use the 

  /* =========================================================================
   * The following will make Marionette's template retrieval work with
   * in both development (templates found in html files) and production
   * environment (templates all compiled AS JST templates into the require.js
   * file. This will also use JST instead of the Marionette.TemplateCache.
   */
  Backbone.Marionette.Renderer.render = function(templateId, data) {
    var path = 'app/templates/' + templateId + '.html';

    // Localize or create a new JavaScript Template object.
    var JST = window.JST = window.JST || {};

    // Make a blocking ajax call (does not reduce performance in production,
    // because templates will be contained by the require.js file).
    if (!JST[path]) {
      $.ajax({
        url: App.root + path,
        async: false
      }).then(function(templateHtml) {
        JST[path] = _.template(templateHtml);
      });
    }

    if (!JST[path]) {
      var msg = 'Could not find "' + templateId + '"';
      var error = new Error(msg);
      error.name = 'NoTemplateError';
      throw error;
    }

    // Call the template function with the data.
    return JST[path](data);
  };
  /* ======================================================================== */

  // Creates a new Marionette application.
  var App = new Marionette.Application();

  // Set up basic paths.
  App.root = '/';

  // Add the main region, that will hold the page layout.
  App.addRegions({
    regionMain: '#main'
  });

  // Adds any methods to be run after the app was initialized.
  // App.addInitializer(function() {
  //   this.initAppLayout();
  // });

  // Start backbone's history for hash navigation after the app was initialized.
  App.on('initialize:after', function() {
    Backbone.history.start({
      pushState: true,
      root: App.root
    });
  });

  // The main initializing function sets up the basic layout and its regions.
  // App.initAppLayout = function() {
  //   var AppLayout = Backbone.Marionette.Layout.extend({
  //     template: 'layouts/default',
  //     regions: {
  //       regionError: '#error', // Contains any error messages.
  //       regionUserInfo: '#userInfo', // Will contain any user controls (login/logout).
  //       regionContent: '#content' // Will contain the page content.
  //     }
  //   });

  //   // Inject the main layout into the #main region of the page.
  //   var layout = new AppLayout();
  //   App.regionMain.show(layout);

  //   // All links with the role attribute set to nav-main will navigate through
  //   // the application's router.
  //   $('a[role=nav-main]').click(function(e) {
  //     e.preventDefault();
  //     App.Router.navigate($(this).attr('href'), {
  //       trigger: true
  //     });
  //   });
  // };

  // Returns the app object to be available to other modules through require.js.
  return App;
});