var objectAssign = require('object-assign');
var memoize = require('memoizee');

function _resolveOutput(func, bindThis) {
  var wrapped = function() {
    var i = arguments.length;
    var args = [];
    while (i--) args[i] = arguments[i];

    // lazy function eval to keep output memory pressure down, if not used
    if (typeof args[0] === 'function') {
      args[0] = args[0]();
    }
    return func.apply(bindThis, args);
  };
  objectAssign(wrapped, func);

  return wrapped;
};


function wrapEval(_debug) {

  var debugOrig = _debug;
  var noop = function(){};

  function debug(namespace) {

    var instance = debugOrig(namespace);

    // if we're not enabled then don't attempt to log anything
    // if a debug namespace wraps its debug in a closure then it never allocates anything but the function itself
    if (!instance.enabled){
      objectAssign(noop, instance);
      instance = noop;
    }
    else {
      instance = _resolveOutput(instance);
    }
    return instance;
  }

  var debugMemoized = memoize(debug);

  objectAssign(debugMemoized, debugOrig);

  return debugMemoized;
}

module.exports = wrapEval;
