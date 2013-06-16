angular.module('musicpad')
.service('socketService', ['$rootScope', '$http', function ($rootScope, $http) {
  console.log('Socket service started.');

  return {
    getUniqueID: function () {
      return $http.get('/api/musicpad');
    },
    /**
     * Returns the socket interface to the requested MusicPad ID
     */
    openSocket: function (uniqueID) {
      var appSocket = io.connect('http://musicpad.vubuntu/'+uniqueID);
      appSocket.on('connect', function () {
        console.log('i did connect.');
      });
      return appSocket;
    }
  };
}]);