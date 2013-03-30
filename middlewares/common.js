// https://github.com/caolan/async/pull/41
// By benalman
// https://raw.github.com/cowboy/jquery-throttle-debounce/v1.1/jquery.ba-throttle-debounce.js
exports.throttle = function( delay, no_trailing, callback, debounce_mode ) {
	var timeout_id,
	  last_exec = 0;

	if ( typeof no_trailing !== 'boolean' ) {
	  debounce_mode = callback;
	  callback = no_trailing;
	  no_trailing = undefined;
	}

	function wrapper() {
	  var that = this,
	    elapsed = +new Date() - last_exec,
	    args = arguments;

	  function exec() {
	    last_exec = +new Date();
	    callback.apply( that, args );
	  };

	  function clear() {
	    timeout_id = undefined;
	  };

	  if ( debounce_mode && !timeout_id ) {
	    exec();
	  }

	  timeout_id && clearTimeout( timeout_id );

	  if ( debounce_mode === undefined && elapsed > delay ) {
	    exec();
	  } else if ( no_trailing !== true ) {
	    timeout_id = setTimeout( debounce_mode ? clear : exec, debounce_mode === undefined ? delay - elapsed : delay );
	  }
	};

	return wrapper;
};