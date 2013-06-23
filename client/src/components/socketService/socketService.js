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
      var appSocket;
      appSocket = $rootScope.pad = io.connect('/'+uniqueID);
      // var appSocket = io.connect('/'+uniqueID);
      appSocket.socket.on('connect', function () {
        console.log('i did connect.');
        $rootScope.$digest();
      });
      appSocket.socket.on('disconnect', function() {
        console.log('ouch, something happnd!');
        $rootScope.$digest();
      });
      // return appSocket;
    },
    request: function (url, type) {
      var appSocket = $rootScope.pad;
      appSocket.emit('request', { url: url, type: type });
    }
  };
}]);