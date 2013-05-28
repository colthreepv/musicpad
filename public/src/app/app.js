angular.module( 'musicpad', [
  'app-templates',
  'component-templates',
  'musicpad.home',
  'musicpad.about',
  'ui.route'
])

.config( function myAppConfig ( $routeProvider ) {
  // $routeProvider
  //   .when({ path: '/', redirectTo: '/about' })
  //   .otherwise({ redirectTo: '/home' });
})

.run( function run ( titleService ) {
  titleService.setSuffix( ' | musicpad' );
})

.controller( 'AppCtrl', function AppCtrl ( $scope, $location ) {
});
