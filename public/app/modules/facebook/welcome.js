define([
  '../../app',
  '../common',
  'facebook'
],
function (app, Common, FB) {
  var exports = { Views: {}, Functions: {}};
  // Deps Injection
  // I want to keep stuff separated, mixing objects makes them BIG, that's bad.
  // _.extend(exports, Common);
  exports.Views.AcceptUs = null;
  exports.Views.FirstPageView = null;
  exports.Functions.FBConnect = null;
  exports.Functions.OnReady = null;

  exports.Functions.FBConnect = function() {
    FB.login(function (response) {
      if (response.authResponse) {
        // console.log('App permission granted!', 'I\'ll now query which permissions he gave me');
        $.ajax({type: 'POST', url: '/api/fb-status', dataType: 'json', data: response }).done(function (data) {
          console.log('FB.login response:', response);
          if (data.permissions) {
            app.layout.setView('#notifications', new Backbone.View(exports.Views.Thanks)).render();
          }
        });
      } else {
        console.log('App permission denied!');
      }
    }, {scope:'email,user_birthday'});
  };

  exports.Functions.OnReady = function (callback) {
    app.user.done(function (data) {
      if (!data.liked) {
        app.layout.setView('#notifications', new Backbone.View({ template: 'facebook/statuses/likeus' })).render();
      } else if (!data.permissions) {
        app.layout.setView('#notifications', new Backbone.View(exports.Views.AcceptUs)).render();
      } 
    });
    if (typeof(callback) === 'function') return callback();
  };

  exports.Views.AcceptUs = _.extend(
    { template: 'facebook/statuses/acceptus' }
    , { events: { 'click a#FBConnect': 'FBConnect' }}
    , { FBConnect: exports.Functions.FBConnect }
  );

  exports.Views.Thanks = _.extend(
    { template: 'facebook/statuses/thanks' }
    , { afterRender: Common.Functions.HideNotification }
  );

  // Definition by extension
  exports.Views.FirstPageView = _.extend(
    { template: 'facebook/first' }
    , { events: { 'click #dumpSession': 'dumpSession', 'click #test': 'testFunct' }}
    , { dumpSession: Common.Functions.dumpSession, testFunct: Common.Functions.testFunction }
    , { afterRender: _.wrap(Common.Functions.DisableGreyOut, exports.Functions.OnReady) }
  );

  return exports;
});