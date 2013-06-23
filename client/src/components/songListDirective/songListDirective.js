angular.module('musicpad')

.directive('musicpadSonglist', ['$rootScope', '$templateCache', '$compile', function ($rootScope, $templateCache, $compile) {

  return {
    link: function (scope, element, attrs) {
      
    },
    controller: 'songListController'
  };
}])

.controller('songListController', ['$scope', function ($scope) {

}]);