define([
  '../../app',
  '../common',
  'bootstrap'
],
function (app, Common) {
  var exports = { Views: {}, Functions: {}};
  exports.Views.Registration = null;
  exports.Functions.OnReady = null;

  exports.Functions.OnReady = function (callback) {
    $('#registerHere input').each(function (index, item) {
      $(item).popover({ trigger: 'hover', delay: { show: 100, hide: 300} });
    });
    $('form#registerHere').submit(function (evt) {
      evt.preventDefault();
      // jquery.validate here
    });
    if (typeof(callback) === 'function') return callback();
  };

  exports.Views.Registration = _.extend(
    { template: 'classic/register' }
    // , { events: { 'click a#FBConnect': 'FBConnect' }}
    , { afterRender: _.wrap(exports.Functions.OnReady, Common.Functions.DisableGreyOut) }
  );

  return exports;
});