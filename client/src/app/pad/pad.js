/**
 * Module that actually manages the musicpad
 */
angular.module( 'musicpad.pad', [])

/**
 * Setup route for this module
 */
.config([ '$routeProvider', function config( $routeProvider ) {
  $routeProvider.when( '/:uniqueID', {
    controller: 'PadController',
    templateUrl: 'pad/pad.tpl.html',
    resolve: { 'checkID': ['$q', '$route', function ($q, $route) {
      var paramCheck = $q.defer();
      /**
       * Regex or complex validation on uniqueID parameter, it could even be async!
       */
      // $timeout(function(){ Not needed for now!
      if ( $route.current.params.uniqueID.length < 10 ) {
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

.directive('searchValidation', function() {
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
          return value;
        } else if (ytRegex.test(value)) {
          ctrl.$setValidity(attrs.name, true); // useless ? :(
          scope.searchBoxType = 'yt';
          elmButton.addClass('btn-success');
          return value;
        } else {
          ctrl.$setValidity(attrs.name, false); // useless ? :(
          scope.searchBoxType = null;
          elmButton.removeClass('btn-success');
        }
      });

      // Bind click on button, to clear btn-success class
      elmButton.bind('click', function (){
        elmButton.removeClass('btn-success');
      });
    }
  };
})

/**
 * And of course we define a controller for our route.
 */
.controller( 'PadController', [
  '$scope',
  '$rootScope',
  '$routeParams',
  'titleService',
  'socketService',
  function PadController( $scope, $rootScope, $routeParams, titleService, socketService ) {
    titleService.setTitle('Pad');
    // $scope.socket = socketService.openSocket($routeParams.uniqueID);
    socketService.openSocket($routeParams.uniqueID);

    $scope.status = function() { console.log('called funct'); return $rootScope.pad.socket.connected; };

    $scope.addSong = function() {
      console.log($scope.searchBox);
      socketService.request($scope.searchBox, $scope.searchBoxType);

      // request sent! GOOOO MUSICPAD!! we can clear the values for our next request :-)
      $scope.searchBox = null;
      $scope.searchBoxType = null;
    };


    $scope.uniqueID = $routeParams.uniqueID;
}]);
