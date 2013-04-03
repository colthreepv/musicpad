define(function() {
  var Models = {};
  Models.yturlModel = Backbone.Model.extend({
    initialize: function() {
      var self = this;
      /**
       * IF it's a valid YouTube URL
       * this.attributes gets sent to vidinfo api
       * and then gets overwritten by the response
       */
      if (self.attributes.url && self.attributes.url.match(/[A-Za-z\d]{11}/)) {
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
  Models.yturlCollection = Backbone.Collection.extend({
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

  // AMD compliance
  return Models;
});