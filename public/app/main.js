require([
  // Application.
    'app'
  // Main Router.
  , 'router'
],

function(app, Router) {

  // Define your master router on the application namespace and trigger all
  // navigation from this instance.
  app.router = new Router();

  /**
   * CSS Initialization
   */
  var CSS = {
    'bootstrap': '/vendor/bootstrap/css/bootstrap.css',
    'bootstrap-responsive': '/vendor/bootstrap/css/bootstrap-responsive.css',
    'yt-albums': '/app/styles/yt-albums.css'
  },
  HTMLhead = document.getElementsByTagName('head')[0];
  /**
   * Appends each CSS Style to the <HEAD>
   */
  _.each(CSS, function (element, index, list) {
    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = element;
    HTMLhead.appendChild(link);
  });
  // Status query to the api to redirect the user to a login page, if needed.
  // Backbone.history starts after the hash gets changed to let the webpage minimize fetches.
  app.userstatus = $.ajax({ type: 'GET', url: '/api/status' })
    .done(function (data, textStatus, jqXHR) {

      if (data === 'unauthorized' && window.location.href.substr(window.location.href.length-5) !== 'login') {
        // window.location.href = window.location.href + 'login';
        window.location.hash = 'login';
      }
      // else { $('#logged_as a').html('Admin Logged').attr('href',''); }

      // Trigger the initial route and enable HTML5 History API support, set the
      // root folder to '/' by default.  Change in app.js.
      // This has to be called after all router dependencies are satifsfied!
      Backbone.history.start({ pushState: true, root: app.root });
    });



  // All navigation that is relative should be passed through the navigate
  // method, to be processed by the router. If the link has a `data-bypass`
  // attribute, bypass the delegation completely.
  $(document).on('click', 'a[href]:not([data-bypass])', function(evt) {
    // Get the absolute anchor href.
    var href = { prop: $(this).prop('href'), attr: $(this).attr('href') };
    // Get the absolute root.
    var root = location.protocol + '//' + location.host + app.root;

    // Ensure the root is part of the anchor href, meaning it's relative.
    if (href.prop.slice(0, root.length) === root) {
      // Stop the default event to ensure the link will not cause a page
      // refresh.
      evt.preventDefault();

      // `Backbone.history.navigate` is sufficient for all Routers and will
      // trigger the correct events. The Router's internal `navigate` method
      // calls this anyways.  The fragment is sliced from the root.
      Backbone.history.navigate(href.attr, true);
    }
  });

});
