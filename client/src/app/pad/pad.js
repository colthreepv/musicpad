/**
 * Module that actually manages the musicpad
 */
angular.module( 'musicpad.pad', [
  'titleService'
])

/**
 * Setup route for this module
 */
.config([ '$routeProvider', function config( $routeProvider ) {
  $routeProvider.when( '/:uniqueid', {
    controller: 'PadController',
    templateUrl: 'pad/pad.tpl.html'
  });
}])

/**
 * And of course we define a controller for our route.
 */
.controller( 'PadController', [
  '$scope',
  '$routeParams',
  'titleService',
  function PadController( $scope, $routeParams, $location, titleService ) {
    //TODO: redirect if parameter:uniqueid don't respect a regex.
    titleService.setTitle( 'Pad' );
}]);
