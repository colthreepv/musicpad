angular.module('musicpad.mock', [])
/**
 * provides the service to the run function
 */
.config(function ($provide) {
  $provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);
})

.run(function ($httpBackend) {
  $httpBackend.when('GET', '/test/data.json').respond(['asd', 'mock is working', 'very WELL!!!']);
});