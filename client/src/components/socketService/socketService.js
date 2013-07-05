angular.module('musicpad')
.service('socketService', ['$rootScope', '$q', function ($rootScope, $q) {
  console.log('Socket service started.');
  var startupped = false
    // this flag is needed to understand if the socket it's in the room before sending messages.
    , joinedRoom = false;

  return {
    getUniqueID: function () {
      var appSocket = $rootScope.io
        , idPromise = $q.defer();
      appSocket.emit('uniqueID');
      appSocket.on('uniqueID', function (uniqueID) {
        idPromise.resolve(uniqueID);
        $rootScope.$digest(); // WHY? Here's why: https://github.com/angular/angular.js/issues/2431
      });
      appSocket.on('error', function (error) {
        idPromise.reject(error);
        $rootScope.$digest();
      });
      return idPromise.promise;
    },
    // used at the startup of the app
    startup: function() {
      var appSocket = $rootScope.io = io.connect();
      startupped = true; // flag to check correct function call order

      appSocket.on('connect', function () {
        console.log('i did connect.');
        $rootScope.$digest();
      });
      appSocket.on('disconnect', function() {
        console.log('ouch, something happnd!');
        $rootScope.$digest();
      });
    },
    // Make the client connect and 'join a pad' or just 'join a pad'
    joinPad: function (uniqueID) {
      var appSocket = $rootScope.io; // this is always defined


      if (!startupped) { throw new Error('startup() must be called before joinPad(), always.'); }
      appSocket.emit('uniqueID', uniqueID);

      // At this point i need to make sure that if in the future the socket disconnects,
      // i can reconnect on the CORRECT room.
      appSocket.removeListener('connect').on('connect', function () {
        appSocket.emit('uniqueID', uniqueID);
      });

      // Room management || IS THAT NECESSARY?!?
      appSocket.on('ready', function () { joinedRoom = true; $rootScope.$digest(); });
      appSocket.removeListener('error').on('error', function (error) { joinedRoom = false; $rootScope.$digest(); });
      // replace old listener with the same listener, that keeps track of socket.io rooms
      appSocket.removeListener('disconnect').on('disconnect', function () { joinedRoom = false; $rootScope.$digest(); });
    },
    request: function (ID, type) {
      var appSocket = $rootScope.io;
      if (!joinedRoom) { throw new Error('you are not connected and trying to make requests!'); }
      appSocket.emit('request', { id: ID, type: type });
    },
    joinedRoom: function () { return joinedRoom; },
    getInstance: function () { return $rootScope.io.socket; },
    listenSocket: function (startingCallback, progressCallback, doneCallback) {
      var appSocket = $rootScope.io; // this is always defined

      appSocket.on('response', function (responseObj) {
        console.log(responseObj);
        if (status === 'starting') {
          startingCallback(responseObj);
        }
        if (status === 'downloading') {
          progressCallback(responseObj);
        }
        if (status === 'done') {
          doneCallback(responseObj);
        }
      });
    }
  };
}]);