define([
   'app'
  , 'router'
  // libs
  , 'jquery'
],
function (App, router, $) {
  'use strict';

  // Use jquery's document ready function to start the app as soon as the DOM
  // was fully loaded.
  $(function() {

    App.Router = router;
    App.start();

  });

});