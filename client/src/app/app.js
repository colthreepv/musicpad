angular.module( 'musicpad', [
  // Templates compiled Statically!
  'app-templates',
  'component-templates',
  // Some pages are separated modules
  'musicpad.home',
  'musicpad.about',
  'musicpad.pad',
  // Main router inclusion
  'ui.route'
  // Very useful HTTP Mock for development ;)
  // 'musicpad.mock'
])

.config( [ '$routeProvider', function myAppConfig ( $routeProvider ) {
  $routeProvider.otherwise({ redirectTo: '/' });
}])

.run( ['titleService', 'socketService', '$rootScope', '$location', function ( titleService, socketService, $rootScope, $location ) {
  titleService.setSuffix( ' | MusicPad' );

  // Manages all the route Erorrs, it could have been much more detailed
  $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
    /**
     * This is a very clever way to implement failure redirection.
     * You can use the value of redirectMap, based on the value of the rejection
     * So you can setup DIFFERENT redirections based on different promise errors.
     */
    $location.path(current.$$route.redirectMap[rejection]).replace();
  });
}])

.controller( 'AppCtrl', ['$scope', function AppCtrl ( $scope ) {
  // TODO: Main Controller here.
}]);
