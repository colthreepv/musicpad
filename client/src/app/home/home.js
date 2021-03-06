/**
 * Each section of the site has its own module. It probably also has
 * submodules, though this boilerplate is too simple to demonstrate it. Within
 * `src/app/home`, however, could exist several additional folders representing
 * additional modules that would then be listed as dependencies of this one.
 * For example, a `note` section could have the submodules `note.create`,
 * `note.delete`, `note.edit`, etc.
 *
 * Regardless, so long as dependencies are managed correctly, the build process
 * will automatically take take of the rest.
 *
 * The dependencies block here is also where component dependencies should be
 * specified, as shown below.
 */
angular.module('musicpad.home', ['titleService'])

/**
 * Each section or module of the site can also have its own routes. AngularJS
 * will handle ensuring they are all available at run-time, but splitting it
 * this way makes each module more "self-contained".
 */
.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/', {
    controller: 'HomeCtrl',
    templateUrl: 'home/home.tpl.html'
  });
}])

/**
 * And of course we define a controller for our route.
 */
.controller('HomeCtrl', ['titleService', '$http', '$scope', '$location', function (titleService, $http, $scope, $location) {
  titleService.setTitle('Home');
  // Dirty way to get new token.
  $scope.getID = function () {
    $http.get('/api/gentoken')
      .success(function (data, status, headers, config) {
        $location.path('/' + data);
      });
  };
}]);
