angular.module('musicpad', [
  // Templates compiled Statically!
  'templates-app',
  'templates-common',
  'ui.router',
  // Musicpad 2.x it's a true single-page-app with 1 module only composed by 5 views.
  'mainpage'
])

.config(function () {
// App configuration here :)
})

.run(function () {
  /* Manages all the route Erorrs, it could have been much more detailed
   * NEEDS TO BE UPDATED TO STATEPROVIDER VERSION...
  $rootScope.$on('$routeChangeError', function (event, current, previous, rejection) {
    **
     * This is a very clever way to implement failure redirection.
     * You can use the value of redirectMap, based on the value of the rejection
     * So you can setup DIFFERENT redirections based on different promise errors.
     *
    $location.path(current.$$route.redirectMap[rejection]).replace();
  });*/
})

.controller('AppCtrl', function ($scope) {
  // App Controller here
  $scope.baseUrl = 'localhost.musicpad';
});
