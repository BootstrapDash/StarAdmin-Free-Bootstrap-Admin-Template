function spawnFactory(_namespace, _debugFabFactory) {
  var memoize = require('memoizee');
  var namespace = _namespace || '';
  var debugFabFactory = _debugFabFactory;

  if(!debugFabFactory){
    debugFabFactory = require('./debugFabFactory')();
  }

  function Debugger(_base, _ns){
    var base = _base || '';
    var ns = _ns || '';

    var newNs = ns ? [base, ns].join(':') : base;
    var debug = debugFabFactory(newNs);

    this.debug = debug;
    this.debug.spawn = this.spawn;
  }

  Debugger.prototype.spawn = function(ns) {
    var dbg = new Debugger(this.namespace, ns);

    return dbg.debug;
  };

  Debugger.prototype.spawn = memoize(Debugger.prototype.spawn);

  var rootDebug = (new Debugger(namespace)).debug;

  return rootDebug;
};

module.exports = spawnFactory;
