angular.module( 'musicpad', [
  // Templates compiled Statically!
  'app-templates',
  'component-templates',
  // Some pages are separated modules
  'musicpad.home',
  'musicpad.about',
  'musicpad.pad',
  // Main router inclusion
  'ui.route',
  // Very useful HTTP Mock for development ;)
  'musicpad.mock'
])

.config( [ '$routeProvider', function myAppConfig ( $routeProvider ) {
  $routeProvider.otherwise({ redirectTo: '/' });
}])

.run( ['titleService', 'socketService', '$location', function ( titleService, socketService, $location ) {
  titleService.setSuffix( ' | MusicPad' );
}])

.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {
  // TODO: Main Controller here.
});
