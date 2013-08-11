/**
 * Module that actually manages the musicpad
 */
angular.module('musicpad.pad', ['btford.socket-io', 'angular-audio-player', 'ui.bootstrap.dropdownToggle', 'monospaced.qrcode'])
/**
 * Setup route for this module
 */
.config(function ($routeProvider, socketProvider) {
  socketProvider.socketOptions = {
    transports: ['websocket', 'xhr-polling'],
    'connect timeout': 3000,
    'max reconnection attempts': 5
  };

  $routeProvider.when('/:uniqueID', {
    controller: 'PadController',
    templateUrl: 'pad/pad.tpl.html',
    resolve: {
      'checkID': ['$q', '$route', function ($q, $route) {
        var paramCheck = $q.defer();
        /**
         * Regex or complex validation on uniqueID parameter, it could even be async!
         */
        // $timeout(function(){ Not needed for now!
        if ($route.current.params.uniqueID.length < 8) {
          paramCheck.reject('uniqueID');
        } else {
          paramCheck.resolve();
        }
        // },0);

        return paramCheck.promise;
      }]
    },
    // Not useful now, but this is good stuff!
    // redirectTo: function (params, current, search) {
    //   if ( params.uniqueID.length < 10 ) {
    //     return '/';
    //   }
    // },
    redirectMap: { 'uniqueID': '/' }
  });

})

.directive('searchValidation', function () {
  return {
    require: 'ngModel',
    link: function (scope, elm, attrs, ctrl) {
      // Thanks to ridgerunner: http://stackoverflow.com/a/13034050/1071793
      var scRegex = /https?:\/\/(?:www.)?soundcloud.com\/([A-Za-z0-9]+(?:[-_][A-Za-z0-9]+)*(?!\/sets(?:\/|$))(?:\/[A-Za-z0-9]+(?:[-_][A-Za-z0-9]+)*){1,2}\/?)/,
      // Thanks to Chris Nolet: http://stackoverflow.com/questions/3452546/javascript-regex-how-to-get-youtube-video-id-from-url#comment11747164_8260383
          ytRegex = /.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/,
          elmButton = angular.element(elm[0].parentNode.querySelector('button'));

      ctrl.$parsers.unshift(function (value) {
        var shortURL = null;
        // Checks if the url provided is a sane youtube/soundcloud url
        if ((shortURL = value.match(scRegex)) !== null) {
          ctrl.$setValidity(attrs.name, true); // useless ? :(
          scope.searchBoxType = 'sc';
          elmButton.addClass('btn-success'); elm.addClass('success');
          shortURL = shortURL.pop();
          elm.val(shortURL);
          return shortURL;
        } else if ((shortURL = value.match(ytRegex)) !== null) {
          ctrl.$setValidity(attrs.name, true); // useless ? :(
          scope.searchBoxType = 'yt';
          elmButton.addClass('btn-success'); elm.addClass('success');
          shortURL = shortURL.pop();
          elm.val(shortURL);
          return shortURL;
        } else {
          ctrl.$setValidity(attrs.name, false); // useless ? :(
          scope.searchBoxType = null;
          elmButton.removeClass('btn-success'); elm.removeClass('success');
        }
      });

      // Bind click on button, to clear btn-success class
      elmButton.bind('click', function () {
        elmButton.removeClass('btn-success');
        elm.removeClass('success');
      });
    }
  };
})

/**
 * And of course we define a controller for our route.
 */
.controller('PadController',
  function ($scope, $routeParams, $log, titleService, socket) {
    var servicePrefixes = {
      'yt': 'ytsux',
      'sc': ''
    };
    var io = socket.getSocket();
    titleService.setTitle($routeParams.uniqueID);


    /**
     * NOTE: in case socket goes down, it makes it join the correct musicPad again.
     * pretty robust implementation :o
     ***********************************************
     * angular-socket-io bindings and declarations *
     */
    if (io.socket.connected) {
      socket.emit('joinPad', $routeParams.uniqueID);
    } else {
      socket.on('connect', function () {
        socket.emit('joinPad', $routeParams.uniqueID);
      });
    }

    socket.on('ready', function () {
      $scope.padConnected = true;
      socket.forward('response', $scope); // setup socket news redirection to $scope
    });
    socket.on('disconnect', function () {
      $scope.padConnected = false;
      socket.removeListener('response');
    });

    $scope.addSong = function () {
      $log.info($scope.searchBox);
      socket.emit('request', { id: $scope.searchBox, type: $scope.searchBoxType });

      // request sent! GOOOO MUSICPAD!! we can clear the values for our next request :-)
      $scope.searchBox = null;
      $scope.searchBoxType = null;
    };

    $scope.uniqueID = $routeParams.uniqueID;

    /**
     **************************************************
     * angular-audio-player bindings and declarations *
     */

    $scope.orderedPlaylist = [];
    $scope.audioPlaylist = [];
    $scope.playingNow = null;
    $scope.loadingSong = false;

    $scope.$on('socket:response', function (event, responseObj) {
      var status = responseObj.status,
          audioElements = [];
      $scope.mainPlaylist = $scope.mainPlaylist || {};


      if (status === 'starting') {
        responseObj.progress = 0;
        $scope.mainPlaylist[responseObj.id] = responseObj;
        $scope.orderedPlaylist.push($scope.mainPlaylist[responseObj.id]); // enqueue in order!
        $log.info($scope.mainPlaylist[responseObj.id]);
      } else if (status === 'progress') {
        angular.extend($scope.mainPlaylist[responseObj.id], responseObj);
      } else if (status === 'complete') {
        responseObj.progress = 100;
        audioElements.push({ src: '/assets/' + responseObj.service + '/' + servicePrefixes[responseObj.service] + responseObj.id + '.mp3', type: 'audio/mpeg' });
        audioElements.push({ src: '/assets/' + responseObj.service + '/' + servicePrefixes[responseObj.service] + responseObj.id + '.ogg', type: 'audio/ogg' });
        responseObj.mp3 = { src: '/download/' + responseObj.service + '/' + servicePrefixes[responseObj.service] + responseObj.id + '.mp3', bitrate: '128' };
        responseObj.ogg = { src: '/download/' + responseObj.service + '/' + servicePrefixes[responseObj.service] + responseObj.id + '.ogg', bitrate: '192' };
        responseObj.audioElements = audioElements;

        // In case the song is cached, you ONLY receive 'complete' event.
        // So let's handle it!
        if (!$scope.mainPlaylist[responseObj.id]) {
          $scope.mainPlaylist[responseObj.id] = responseObj;
          $scope.orderedPlaylist.push($scope.mainPlaylist[responseObj.id]);
          $scope.audioPlaylist.push(audioElements);
          return;
        }

        angular.extend($scope.mainPlaylist[responseObj.id], responseObj);
        $scope.audioPlaylist.push(audioElements);
        $log.info($scope.mainPlaylist[responseObj.id]);
      }
    });

    // On pause we don't play anything ;)
    $scope.$on('audioplayer:pause', function (event) {
      $scope.playingNow = null;
    });
    $scope.$on('audioplayer:play', function (event, playlistIndex) {
      $scope.loadingSong = false;
      $scope.playingNow = $scope.orderedPlaylist[playlistIndex];
    });
    $scope.$on('audioplayer:load', function (event, autoplayNext) {
      $scope.loadingSong = autoplayNext;
    });

    $scope.playPause = function (index) {
      if ($scope.orderedPlaylist[index].status === 'complete') {
        $scope.audio.playPause(index);
      }
    };
  }
);
