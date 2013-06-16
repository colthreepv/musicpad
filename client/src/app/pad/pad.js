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
    templateUrl: 'pad/pad.tpl.html',
    resolve: { 'checkID': ['$q', '$route', '$timeout', function ($q, $route, $timeout) {
      var paramCheck = $q.defer();
      /**
       * Regex or complex validation on uniqueID parameter, it could even be async!
       */
      $timeout(function(){
        if ( $route.current.params.uniqueid.length < 10 ) {
          paramCheck.reject('uniqueID');
        } else {
          paramCheck.resolve();
        }
      },0);

      return paramCheck.promise;
    }] },
    // Not useful now, but this is good stuff!
    // redirectTo: function (params, current, search) {
    //   if ( params.uniqueid.length < 10 ) {
    //     return '/';
    //   }
    // },
    redirectMap: { 'uniqueID': '/' }
  });
}])

/**
 * And of course we define a controller for our route.
 */
.controller( 'PadController', [
  '$scope',
  '$routeParams',
  'titleService',
  'checkID',
  function PadController( $scope, $routeParams, titleService, checkID ) {
    titleService.setTitle( 'Pad' );
    console.log(checkID);
}]);
