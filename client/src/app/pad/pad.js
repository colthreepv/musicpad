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
  $routeProvider.when( '/:uniqueID', {
    controller: 'PadController',
    templateUrl: 'pad/pad.tpl.html',
    resolve: { 'checkID': ['$q', '$route', function ($q, $route) {
      var paramCheck = $q.defer();
      /**
       * Regex or complex validation on uniqueID parameter, it could even be async!
       */
      // $timeout(function(){ Not needed for now!
      if ( $route.current.params.uniqueID.length < 10 ) {
        paramCheck.reject('uniqueID');
      } else {
        paramCheck.resolve();
      }
      // },0);

      return paramCheck.promise;
    }] },
    // Not useful now, but this is good stuff!
    // redirectTo: function (params, current, search) {
    //   if ( params.uniqueID.length < 10 ) {
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
  '$rootScope',
  '$routeParams',
  'titleService',
  'socketService',
  function PadController( $scope, $rootScope, $routeParams, titleService, socketService ) {
    titleService.setTitle('Pad');
    // $scope.socket = socketService.openSocket($routeParams.uniqueID);
    socketService.openSocket($routeParams.uniqueID);
    $scope.pad = $rootScope.pad;
    $scope.status = function() { return $scope.pad.socket.connected; };



    $scope.uniqueID = $routeParams.uniqueID;
}]);
