angular.module('musicpad')
.service('socketService', ['$rootScope', function ($rootScope) {
  console.log('Socket service started.');

  return {
    getUniqueID: function () {},
    openSocket: function (id) {
      debugger;
    }
  };
}]);