angular.module( 'musicpad', [
  'app-templates',
  'component-templates',
  'musicpad.home',
  'musicpad.about',
  'ui.route',
  'musicpad.mock'
])

.config( function myAppConfig ( $routeProvider ) {
  $routeProvider.otherwise({ redirectTo: '/home' });
})

.run( function run ( titleService ) {
  titleService.setSuffix( ' | MusicPad' );
})

.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {
  // TODO: Main Controller here.
});
