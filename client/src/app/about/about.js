angular.module( 'musicpad.about', [
  'placeholders',
  'ui.bootstrap',
  'titleService'
])

.config(function config( $routeProvider ) {
  $routeProvider.when( '/about', {
    controller: 'AboutCtrl',
    templateUrl: 'about/about.tpl.html'
  });
})

.controller( 'AboutCtrl', function AboutCtrl( $scope, $http, titleService ) {
  /* setta il titolo*/
  titleService.setTitle( 'Siamo in about' );

  /* inizializza il menu vuoto */
  $scope.dropdownDemoItems = [];

  $http.get('/test/data.json').success(function(data, status) {

    console.log("dentro la get");
    $scope.dropdownDemoItems = data;
  }).error(function() { console.log ("error"); });
});
