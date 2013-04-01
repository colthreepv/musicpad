define([
    '../app'
  , './common'
],
function (app, Common) {
  var HomePage = app.module()
    , yturlChange = null;
  HomePage.Views.Main = null;

  yturlChange = _.throttle(function (event) {
    // Okey i found this regex online, but it's not a charm, my very short version works decently aswell.
    // var urlRegex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|(?:embed|v)\/))?([^\?&"'>]{11})/
    var urlRegex = /[A-Za-z\d]{11}/
      , result = null
      // , lastURL = window.lastURL
      , textField = event.target.value;
    if (result = textField.match(urlRegex)) {
      if (window.lastURL !== result[0]) {
        window.lastURL = result[0];
        console.log('valid youtube url', window.lastURL);
      }
    }
  }, 150);

  HomePage.Views.Main = {
      template: 'indexpage'
    , el: false
    , events: _.extend({
        'keyup #yturl': yturlChange
      , 'paste #yturl': yturlChange
      , 'cut #yturl': yturlChange
      , 'click #yturl': yturlChange
    }, Common.InputEvents)
  };

  return HomePage;
});