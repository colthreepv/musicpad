angular.module('musicpad')

.directive('musicpadSonglist', ['$rootScope', '$templateCache', '$compile', function ($rootScope, $templateCache, $compile) {

  return {
    link: function (scope, element, attrs) {
      
    },
    controller: 'songListController'
  };
}])

.controller('songListController',
  ['$scope', '$rootScope', 'socketService',
  function ($scope, $rootScope, socketService) {
    $scope.$watch(function () { return socketService.joinedRoom; },
      function (joinedRoom) {
        if (!joinedRoom) { return; }

      });

}]);