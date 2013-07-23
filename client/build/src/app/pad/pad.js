/**
 * Module that actually manages the musicpad
 */
angular.module('musicpad.pad', [])

/**
 * Setup route for this module
 */
.config(['$routeProvider', function config($routeProvider) {
  $routeProvider.when('/:uniqueID', {
    controller: 'PadController',
    templateUrl: 'pad/pad.tpl.html',
    resolve: { 'checkID': ['$q', '$route', function ($q, $route) {
      var paramCheck = $q.defer();
      /**
       * Regex or complex validation on uniqueID parameter, it could even be async!
       */
      // $timeout(function(){ Not needed for now!
      if ($route.current.params.uniqueID.length < 10) {
        paramCheck.reject('uniqueID');
      } else {
        paramCheck.resolve();
      }
      // },0);

      return paramCheck.promise;
    }] },
    // Not useful now, but this is good stuff!
    // redirectTo: function (params, current, search) {
    //   if ( params.uniqueID.length < 10 ) {
    //     return '/';
    //   }
    // },
    redirectMap: { 'uniqueID': '/' }
  });
}])

.directive('searchValidation', function () {
  return {
    require: 'ngModel',
    link: function (scope, elm, attrs, ctrl) {
      var scRegex = /(?:https?\:\/\/)?.*?soundcloud.com\/(.{3,}?)\/(.{3,})/
        , ytRegex = /(?:https?\:\/\/).*?(?:(?:youtube.com\/watch.*?v\=(?:.*?)(?:\s|$))|(?:youtu.be\/(?:.*)))/
        , elmButton = angular.element(elm[0].parentNode.querySelector('button'));

      ctrl.$parsers.unshift(function (value) {
        // Checks if the url provided is a sane youtube/soundcloud url
        if (scRegex.test(value)) {
          ctrl.$setValidity(attrs.name, true); // useless ? :(
          scope.searchBoxType = 'sc';
          elmButton.addClass('btn-success');
          return value.match(/soundcloud.com\/(.*)/).pop();
        } else if (ytRegex.test(value)) {
          ctrl.$setValidity(attrs.name, true); // useless ? :(
          scope.searchBoxType = 'yt';
          elmButton.addClass('btn-success');
          return value.match(/watch(?:.*?)v\=(.*?)(?:&|$)/).pop();
        } else {
          ctrl.$setValidity(attrs.name, false); // useless ? :(
          scope.searchBoxType = null;
          elmButton.removeClass('btn-success');
        }
      });

      // Bind click on button, to clear btn-success class
      elmButton.bind('click', function () {
        elmButton.removeClass('btn-success');
      });
    }
  };
})

/**
 * And of course we define a controller for our route.
 */
.controller('PadController', [
  '$scope',
  '$routeParams',
  'titleService',
  'socket',
  function PadController($scope, $routeParams, titleService, socket) {
    titleService.setTitle($routeParams.uniqueID);

    // NOTE: in case socket goes down, it makes it join the correct musicPad again.
    // pretty robust implementation :o
    socket.on('connect', function () { socket.emit('joinPad', $routeParams.uniqueID); });

    socket.on('ready', function () {
      $scope.padConnected = true;
      socket.forward('response', $scope); // setup socket news redirection to $scope
    });
    socket.on('disconnect', function () {
      $scope.padConnected = false;
      socket.removeListener('response');
    });

    $scope.addSong = function () {
      console.log($scope.searchBox);
      // OLD socketService.request($scope.searchBox, $scope.searchBoxType);
      socket.emit('request', { id: $scope.searchBox, type: $scope.searchBoxType });

      // request sent! GOOOO MUSICPAD!! we can clear the values for our next request :-)
      $scope.searchBox = null;
      $scope.searchBoxType = null;
    };

    $scope.uniqueID = $routeParams.uniqueID;

    /* Dummy infos.
    $scope.mainPlaylist = {};
    $scope.mainPlaylist['some-artist/some-track'] = {
      status: 'starting',
      title: 'Some Artist - Some Track!',
      hq: true,
      progress: 80
    };*/

    $scope.orderedPlaylist = [];

    $scope.$on('socket:response', function (event, responseObj) {
      $scope.mainPlaylist = $scope.mainPlaylist || {};

      if (responseObj.status === 'starting') {
        responseObj.progress = 0;
        $scope.mainPlaylist[responseObj.id] = responseObj;
        $scope.orderedPlaylist.push($scope.mainPlaylist[responseObj.id]); // enqueue in order!
        console.log($scope.mainPlaylist[responseObj.id]);
      }
      if (responseObj.status === 'progress') {
        angular.extend($scope.mainPlaylist[responseObj.id], responseObj);
        console.log($scope.mainPlaylist[responseObj.id]);
      }
      if (responseObj.status === 'complete') {
        responseObj.progress = 100;
        angular.extend($scope.mainPlaylist[responseObj.id], responseObj);
        console.log($scope.mainPlaylist[responseObj.id]);
      }
    });
    
  }
]);
