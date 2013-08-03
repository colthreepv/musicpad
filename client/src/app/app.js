angular.module('musicpad', [
  // Templates compiled Statically!
  'templates-app',
  'templates-common',
  // Some pages are separated modules
  'musicpad.home',
  'musicpad.pad',
  // Main router inclusion
  // 'ui.route' That is not router....
  // Very useful HTTP Mock for development ;)
  // 'musicpad.mock'
  // btford/angular-socket-io
  'btford.socket-io',
  'angular-audio-player'
])

.config([ '$routeProvider', function myAppConfig($routeProvider) {
  $routeProvider.otherwise({ redirectTo: '/' });
}])

.run(['titleService', '$rootScope', '$location', function (titleService, $rootScope, $location) {
  titleService.setSuffix(' | MusicPad');

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

.controller('AppCtrl', ['$scope', function AppCtrl($scope) {
  // TODO: Main Controller here.
}]);
