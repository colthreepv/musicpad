define([
    '../app'
  , './common'
],
function (app, Common) {
  var HomePage = app.module()
    , yturlChange = null;
  HomePage.Views.Main = null;

  yturlChange = _.throttle(function (event) {
    var urlRegex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|(?:embed|v)\/))?([^\?&"'>]{11})/
      , result = null
      , lastURL = null
      , textField = event.target.value;
    if (result = textField.match(urlRegex)) {
      debugger;
      if (lastURL !== result[1]) {
        lastURL = result[1];
        console.log('valid youtube url', lastURL);
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