angular.module('mainpage', ['soundcloudPartial', 'youtubePartial', 'musicpadPartial', 'playerPartial', 'helperPartial'])

.config(function ($stateProvider) {
  $stateProvider
  .state('main', {
    abstract: true,
    templateUrl: 'main.tpl.html',
    controller: 'MainController'
  })
  .state('main.views', {
    url: '',
    views: {
      'soundcloud': {
        templateUrl: 'main/soundcloud.tpl.html',
        controller: 'SoundcloudController'
      },
      'youtube': {
        templateUrl: 'main/youtube.tpl.html',
        controller: 'YoutubeController',
        resolve: {
          'youtubeAPI': function ($q, $timeout) {
            var defer = $q.defer();

            fallback.load({ youtubeAPI: '//apis.google.com/js/client.js' });
            fallback.ready(function () { $timeout(defer.resolve); });

            return defer.promise;
          }
        }
      },
      'musicpad': {
        templateUrl: 'main/musicpad.tpl.html',
        controller: 'MusicpadController'
      },
      'player': {
        templateUrl: 'main/player.tpl.html',
        controller: 'PlayerController'
      },
      'helper': {
        templateUrl: 'main/helper.tpl.html',
        controller: 'HelperController'
      }
    }
  });
})
.controller('MainController', function ($scope) {
  // Main controller data here.
});
