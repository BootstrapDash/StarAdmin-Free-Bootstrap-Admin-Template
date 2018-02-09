// It's actually "debounce"

'use strict';

var callable     = require('es5-ext/object/valid-callable')
  , nextTick     = require('next-tick')
  , validTimeout = require('./valid-timeout')

  , apply = Function.prototype.apply;

module.exports = function (fn/*, timeout*/) {
	var scheduled, run, context, args, delay, timeout = arguments[1], handle;
	callable(fn);
	if (timeout == null) {
		delay = nextTick;
	} else {
		timeout = validTimeout(timeout);
		delay = setTimeout;
	}
	run = function () {
		if (!scheduled) return; // IE8 tends to not clear immediate timeouts properly
		scheduled = false;
		handle = null;
		apply.call(fn, context, args);
		context = null;
		args = null;
	};
	return function () {
		if (scheduled) {
			if (handle == null) {
				// 'nextTick' based, no room for debounce
				return;
			}
			clearTimeout(handle);
		}
		scheduled = true;
		context = this;
		args = arguments;
		handle = delay(run, timeout);
	};
};
