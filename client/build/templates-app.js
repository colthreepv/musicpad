angular.module('templates-app', ['home/home.tpl.html', 'pad/pad.tpl.html']);

angular.module("home/home.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("home/home.tpl.html",
    "<div class=\"hero-unit\">\n" +
    "  <h1>Hello World!</h1>\n" +
    "  <button class=\"btn btn-primary btn-large\" ng-click=\"getID()\">Get an UniqueID</button>\n" +
    "</div>\n" +
    "");
}]);

angular.module("pad/pad.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("pad/pad.tpl.html",
    "<div class=\"navbar navbar-inverse\">\n" +
    "  <div class=\"navbar-inner\">\n" +
    "    <a class=\"brand\" href=\"#\">MusicPad:</a>\n" +
    "    <ul class=\"nav\">\n" +
    "      <li class=\"active\"><a href=\"\">{{uniqueID}}</a></li>\n" +
    "      <li ng-show=\"padConnected\"><a>Connected <i class=\"icon-ok-sign\"></i></a></li>\n" +
    "      <li ng-show=\"!padConnected\"><a>Disconnected <i class=\"icon-exclamation\"></i></a></li>\n" +
    "    </ul>\n" +
    "  </div>\n" +
    "</div>\n" +
    "<div class=\"musicpad-container\">\n" +
    "  <div class=\"song-column\">\n" +
    "    <div class=\"search-box\">\n" +
    "      <form name=\"searchForm\" ng-submit=\"addSong()\">\n" +
    "        <div class=\"input-append\">\n" +
    "          <input type=\"text\" name=\"addsong\" ng-model=\"searchBox\" placeholder=\"Add a youtube / soundcloud URL\" search-validation ng-disabled=\"!padConnected\" autofocus>\n" +
    "          <button class=\"btn\" type=\"submit\" ng-disable=\"searchForm.$invalid\">\n" +
    "            <i class=\"icon-question-sign\" ng-show=\"!searchBoxType\"></i>\n" +
    "            <i class=\"icon-plus\" ng-show=\"searchBoxType == 'sc'\"></i>\n" +
    "            <i class=\"icon-plus\" ng-show=\"searchBoxType == 'yt'\"></i>\n" +
    "          </button>\n" +
    "        </div>\n" +
    "      </form>\n" +
    "    </div>\n" +
    "    <div ng-repeat=\"song in orderedPlaylist\" ng-animate=\"{ enter: 'show' }\">\n" +
    "      <div class=\"song-container\">\n" +
    "        <span ng-class=\"song.status\" ng-style=\"{ width: song.progress + '%' }\"></span>\n" +
    "        <div class=\"song-element\">\n" +
    "          <p>{{ song.title }}</p>\n" +
    "          <span class=\"icon-stack\" ng-show=\"song.type == 'sc'\"><i class=\"icon-sign-blank icon-stack-base\"></i><i class=\"icon-cloud\"></i></span>\n" +
    "          <i class=\"icon-youtube-play\" ng-show=\"song.type == 'yt'\"></i>\n" +
    "        </div>\n" +
    "      </div>\n" +
    "    </div>\n" +
    "  </div>\n" +
    "  <div class=\"welcome-column hero-unit\">\n" +
    "    <h1>Insightful infos.</h1>\n" +
    "  </div>\n" +
    "</div>\n" +
    "\n" +
    "");
}]);
