define([
    '../app'
  , './common'
  , 'text!../templates/partials/videoinfo.html'
],
function (app, Common, VideoInfoHTML) {
  var HomePage = app.module()
    , yturlChange = null
    , yturlModel = null
    , yturlCollection = null
    , InfoLayout = null;
  HomePage.Views.Main = null;

  // Move the Model && Collection declarations out of here, maybe?
  yturlModel = Backbone.Model.extend({
    initialize: function() {
      var self = this;
      /**
       * IF it's a valid YouTube URL
       * this.attributes gets sent to vidinfo api
       * and then gets overwritten by the response
       */
      if (self.attributes.url && self.attributes.url.match(/[A-Za-z\d-]{11}/)) {
        $.ajax({type: 'POST', url: '/api/vidinfo', dataType: 'json', data: self.attributes })
          .done(function (data) {
            self.attributes = data;
            // self as argument is necessary to understand from which object the event started
            // since it gets mimicked from the collection thanks to _onModelEvent
            self.trigger('ready', self);
          });
      } else {
        self.attributes = {};
        self.trigger('ready', self);
      }
    }
  });
  /**
   * FUTURE REFERENCE
   * TO check for already-added videos, use
   * collection.filter(function (yturl){ if ( yturl.get('video_id') === 'CPkEkJQLrks' ) return yturl;  })
   */
  yturlCollection = Backbone.Collection.extend({
      model: yturlModel
      /**
       * overriding add to manage async nature of this particular Model ^_^
       *
       * WARNING: not managing double models, if we add TWICE the same yturl, it gets added twice!
       *          Is that a good thing ?!?
       */
       // HOWTO DEBUG: newcollection.bind('all', function (eventname) { debugger; console.log('an event fired:',eventname);  } );
    , add: function(yturl) {
        var modelopts = { url: yturl }
          , self = this;
        Backbone.Collection.prototype.add.call(self, modelopts, {silent: true});
        self.models[self.length-1].bind('ready', function(){ self.trigger('add', self.models[self.length-1], self, yturl); });
    }
  });
  HomePage.Collection = new yturlCollection();

  /**
   * Order of command to display youtube video info
   *
   * 1) User writes correct url
   * 2) yturlChange calls ??!!??? Collection.Add ?
   * 3) Collection.Add - must be bind to the .hero container!!!!
   *    - if we bind to the 'add' event, this partial-view will have INCORRECT INFORMATIONS!
   */

  yturlChange = _.throttle(function (event) {
    // Okey i found this regex online, but it's not a charm, my very short version works decently aswell.
    // var urlRegex = /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|(?:embed|v)\/))?([^\?&"'>]{11})/
    var urlRegex = /[A-Za-z\d-]{11}/
      , result = null
      , textField = event.target.value;
    if (result = textField.match(urlRegex)) {
      if (window.lastURL !== result[0]) {
        window.lastURL = result[0];
        console.log('valid youtube url', window.lastURL);
        HomePage.Collection.add(window.lastURL);
      }
    }
  }, 250);

  InfoLayout = Backbone.Layout.extend({
      collection: HomePage.Collection
    , viewHTML: $(VideoInfoHTML)
    , initialize: function (Layout) {
        this.collection.bind('add', function (model, collection, options) {
          debugger;
        });
      }
    , el: function() {
        // Careful here, trim() is necessary.
        return $(this.viewHTML[0]).html().trim();
      }
  });

  HomePage.Views.Main = Backbone.Layout.extend({
      template: 'indexpage'
    , el: false
    , collection: HomePage.Collection
    , events: _.extend({
        'keyup #yturl': yturlChange
      , 'paste #yturl': yturlChange
      , 'cut #yturl': yturlChange
      , 'click #yturl': yturlChange
      }, Common.InputEvents)
    , views: { '.hero-unit': new InfoLayout(HomePage.Collection) }
  });

  return HomePage;
});