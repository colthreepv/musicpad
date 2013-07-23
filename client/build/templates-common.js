angular.module('templates-common', ['songListDirective/songListDirective.tpl.html']);

angular.module("songListDirective/songListDirective.tpl.html", []).run(["$templateCache", function($templateCache) {
  $templateCache.put("songListDirective/songListDirective.tpl.html",
    "");
}]);
