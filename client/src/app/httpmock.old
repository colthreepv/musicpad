angular.module('musicpad.mock', ['ngMockE2E'])
/**
 * provides the service to the run function
 */
.config(function($provide) {
  $provide.decorator('$httpBackend', function($delegate) {
    var proxy = function(method, url, data, callback, headers) {
      var interceptor = function() {
        var _this = this,
          _arguments = arguments;
        setTimeout(function() {
          callback.apply(_this, _arguments);
        }, 500);
      };
      return $delegate.call(this, method, url, data, interceptor, headers);
    };
    for(var key in $delegate) {
      proxy[key] = $delegate[key];
    }
    return proxy;
  });
})


.run(function ($httpBackend) {
  $httpBackend.when('GET', '/test/data.json').respond(['asd', 'mock is working', 'very WELL!!!']);
});