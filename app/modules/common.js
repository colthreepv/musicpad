define([
  'facebook',
  'spinjs',
  'jquery.Spin'
],
function (FB) {
  var exports = { Views: {}, Functions: {}};
  exports.Functions.GreyOut = null;
  exports.Functions.DisableGreyOut = null;
  exports.Functions.setSession = null;
  exports.Functions.dumpSession = null;
  exports.Functions.HideNotification = null;

  exports.Functions.GreyOut = function() {
    // Create Spinning element above greyed out area
    var spinner = $(document.createElement('div')).addClass('greyoutSpinner');
    $('#pusher').append(spinner);
    spinner.spin("small");
  };
  exports.Functions.DisableGreyOut = function (callback) {
    // Disable Grey out
    $('.greyoutSpinner').remove();
    $('#pusher').removeClass('covered');
    if (typeof(callback) === 'function') return callback();
  };

  // Development Session Hacks
  exports.Functions.setSession = function() {
    // console.log(arguments);
    $.post('/api/setSession', { set: $('#setSessionValue').val() }).done(function (data) {
      console.log('status response:', data);
    });
  };
  exports.Functions.dumpSession = function() {
    $.post('/api/dumpSession').done(function (data) {
      console.log('status response:', data);
    });    
  };
  exports.Functions.HideNotification = function() {
    $('.alert').fadeOut(3000);
  };

  exports.Functions.testFunction = function() {
    FB.getLoginStatus(function (response) {
      // response = {
      //   'id': 772306753,
      //   'permissions': 1,
      //   'short_access_token': 'AAAFQ8mX3VOsBAP7uv1jlXewmRmmUB30nZCSgpOx76b2OnxwUGyBWXQAANQg1k1y7VDOBahrXgsP7sQX7oYLv9Kx3KclBcb8FvGW4vNQZDZD',
      //   'liked': 1
      // };
      response = {"permissions":"1","id":"772306753","short_access_token":"AAAFQ8mX3VOsBAON39k9cEhQZAaxayGVf6unCMZC7y5OdZCuPWOYIgU7s34t1Yktn56ZArZB07TbiOuxuZCMf0kjMjUrie9fDIFYAeZAvZA52oAZDZD","liked":"1"};
      $.post('/api/extendedToken', response);
    }, true);
  };

  return exports;
});