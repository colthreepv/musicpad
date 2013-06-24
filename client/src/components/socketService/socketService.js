angular.module('musicpad')
.service('socketService', ['$rootScope', '$q', function ($rootScope, $q) {
  console.log('Socket service started.');

  return {
    getUniqueID: function () {
      var appSocket = $rootScope.pad
        , idPromise = $q.defer();
      appSocket.emit('uniqueID');
      appSocket.on('uniqueID', function (uniqueID) {
        console.log('return');
        idPromise.resolve(uniqueID);
      });
      appSocket.on('error', idPromise.reject);
      return idPromise.promise;
    },
    // used at the startup of the app
    startup: function() {
      var appSocket = $rootScope.pad = io.connect();
      appSocket.on('connect', function () {
        console.log('i did connect.');
        $rootScope.$digest();
      });
      appSocket.on('disconnect', function() {
        console.log('ouch, something happnd!');
        $rootScope.$digest();
      });
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