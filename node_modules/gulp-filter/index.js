'use strict';
var gutil = require('gulp-util');
var multimatch = require('multimatch');
var path = require('path');
var streamfilter = require('streamfilter');

module.exports = function (pattern, options) {
	pattern = typeof pattern === 'string' ? [pattern] : pattern;
	options = options || {};

	if (!Array.isArray(pattern) && typeof pattern !== 'function') {
		throw new gutil.PluginError('gulp-filter', '`pattern` should be a string, array, or function');
	}

	return streamfilter(function (file, enc, cb) {
		var match = typeof pattern === 'function' ? pattern(file) :
			multimatch(path.relative(file.cwd, file.path), pattern, options).length > 0;

		cb(!match);
	}, {
		objectMode: true,
		passthrough: options.passthough !== false,
		restore: options.restore
	});
};
