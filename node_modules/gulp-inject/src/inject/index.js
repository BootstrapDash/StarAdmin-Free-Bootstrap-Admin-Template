'use strict';
var through2 = require('through2');
var gutil = require('gulp-util');
var streamToArray = require('stream-to-array');
var escapeStringRegexp = require('escape-string-regexp');
var groupArray = require('group-array');
var extname = require('../extname');
var transform = require('../transform');
var tags = require('../tags');
var getFilepath = require('../path');

var PluginError = gutil.PluginError;
var magenta = gutil.colors.magenta;
var cyan = gutil.colors.cyan;
var noop = function noop() {};

/**
 * Constants
 */
var PLUGIN_NAME = 'gulp-inject';
var DEFAULT_NAME_FOR_TAGS = 'inject';
var LEADING_WHITESPACE_REGEXP = /^\s*/;

module.exports = exports = function (sources, opt) {
  if (!sources) {
    throw error('Missing sources stream!');
  }
  if (!opt) {
    opt = {};
  }

  if (opt.sort) {
    throw error('sort option is deprecated! Use `sort-stream` module instead!');
  }
  if (opt.templateString) {
    throw error('`templateString` option is deprecated! Create a virtual `vinyl` file instead!');
  }
  if (opt.transform && typeof opt.transform !== 'function') {
    throw error('transform option must be a function');
  }
  // Notify people of common mistakes...
  if (typeof opt.read !== 'undefined') {
    throw error('There is no `read` option. Did you mean to provide it for `gulp.src` perhaps?');
  }

  // Defaults:
  opt.quiet = bool(opt, 'quiet', false);
  opt.relative = bool(opt, 'relative', false);
  opt.addRootSlash = bool(opt, 'addRootSlash', !opt.relative);
  opt.transform = defaults(opt, 'transform', transform);
  opt.tags = tags();
  opt.name = defaults(opt, 'name', DEFAULT_NAME_FOR_TAGS);
  transform.selfClosingTag = bool(opt, 'selfClosingTag', false);

  // Is the first parameter a Vinyl File Stream:
  if (typeof sources.on === 'function' && typeof sources.pipe === 'function') {
    return handleVinylStream(sources, opt);
  }

  throw error('passing target file as a string is deprecated! Pass a vinyl file stream (i.e. use `gulp.src`)!');
};

function defaults(options, prop, defaultValue) {
  return options[prop] || defaultValue;
}

function bool(options, prop, defaultVal) {
  return typeof options[prop] === 'undefined' ? defaultVal : Boolean(options[prop]);
}

/**
 * Handle injection when files to
 * inject comes from a Vinyl File Stream
 *
 * @param {Stream} sources
 * @param {Object} opt
 * @returns {Stream}
 */
function handleVinylStream(sources, opt) {
  var collected = streamToArray(sources);

  return through2.obj(function (target, enc, cb) {
    if (target.isStream()) {
      return cb(error('Streams not supported for target templates!'));
    }
    collected.then(function (collection) {
      target.contents = getNewContent(target, collection, opt);
      this.push(target);
      cb();
    }.bind(this))
    .catch(function (err) {
      cb(err);
    });
  });
}

/**
 * Get new content for template
 * with all injections made
 *
 * @param {Object} target
 * @param {Array} collection
 * @param {Object} opt
 * @returns {Buffer}
 */
function getNewContent(target, collection, opt) {
  var logger = opt.quiet ? noop : function (filesCount) {
    if (filesCount) {
      log(cyan(filesCount) + ' files into ' + magenta(target.relative) + '.');
    } else {
      log('Nothing to inject into ' + magenta(target.relative) + '.');
    }
  };
  var content = String(target.contents);
  var targetExt = extname(target.path);
  var files = prepareFiles(collection, targetExt, opt, target);
  var filesPerTags = groupArray(files, 'tagKey');
  var startAndEndTags = Object.keys(filesPerTags);
  var matches = [];
  var injectedFilesCount = 0;

  startAndEndTags.forEach(function (tagKey) {
    var files = filesPerTags[tagKey];
    var startTag = files[0].startTag;
    var endTag = files[0].endTag;
    var tagsToInject = getTagsToInject(files, target, opt);
    content = inject(content, {
      startTag: startTag,
      endTag: endTag,
      tagsToInject: tagsToInject,
      removeTags: opt.removeTags,
      empty: opt.empty,
      willInject: function (filesToInject) {
        injectedFilesCount += filesToInject.length;
      },
      onMatch: function (match) {
        matches.push(match[0]);
      }
    });
  });

  logger(injectedFilesCount);

  if (opt.empty) {
    var ext = '{{ANY}}';
    var startTag = getTagRegExp(opt.tags.start(targetExt, ext, opt.starttag), ext, opt);
    var endTag = getTagRegExp(opt.tags.end(targetExt, ext, opt.starttag), ext, opt);

    content = inject(content, {
      startTag: startTag,
      endTag: endTag,
      tagsToInject: [],
      removeTags: opt.removeTags,
      empty: opt.empty,
      shouldAbort: function (match) {
        return matches.indexOf(match[0]) !== -1;
      }
    });
  }

  return new Buffer(content);
}

/**
 * Inject tags into content for given
 * start and end tags
 *
 * @param {String} content
 * @param {Object} opt
 * @returns {String}
 */
function inject(content, opt) {
  var startTag = opt.startTag;
  var endTag = opt.endTag;
  var startMatch;
  var endMatch;

  /**
   * The content consists of:
   *
   * <everything before startMatch>
   * <startMatch>
   * <previousInnerContent>
   * <endMatch>
   * <everything after endMatch>
   */

  while ((startMatch = startTag.exec(content)) !== null) {
    if (typeof opt.onMatch === 'function') {
      opt.onMatch(startMatch);
    }
    if (typeof opt.shouldAbort === 'function' && opt.shouldAbort(startMatch)) {
      continue;
    }
    // Take care of content length change:
    endTag.lastIndex = startTag.lastIndex;
    endMatch = endTag.exec(content);
    if (!endMatch) {
      throw error('Missing end tag for start tag: ' + startMatch[0]);
    }
    var toInject = opt.tagsToInject.slice();

    if (typeof opt.willInject === 'function') {
      opt.willInject(toInject);
    }

    // <everything before startMatch>:
    var newContents = content.slice(0, startMatch.index);

    if (opt.removeTags) {
      if (opt.empty) {
        // Take care of content length change:
        startTag.lastIndex -= startMatch[0].length;
      }
    } else {
      // <startMatch> + <endMatch>
      toInject.unshift(startMatch[0]);
      toInject.push(endMatch[0]);
    }
    var previousInnerContent = content.substring(startTag.lastIndex, endMatch.index);
    var indent = getLeadingWhitespace(previousInnerContent);
    // <new inner content>:
    newContents += toInject.join(indent);
    // <everything after endMatch>:
    newContents += content.slice(endTag.lastIndex);
    // replace old content with new:
    content = newContents;
  }

  return content;
}

function getLeadingWhitespace(str) {
  return str.match(LEADING_WHITESPACE_REGEXP)[0];
}

function prepareFiles(files, targetExt, opt, target) {
  return files.map(function (file) {
    var ext = extname(file.path);
    var filePath = getFilepath(file, target, opt);
    var startTag = getTagRegExp(opt.tags.start(targetExt, ext, opt.starttag), ext, opt, filePath);
    var endTag = getTagRegExp(opt.tags.end(targetExt, ext, opt.endtag), ext, opt, filePath);
    var tagKey = String(startTag) + String(endTag);
    return {
      file: file,
      ext: ext,
      startTag: startTag,
      endTag: endTag,
      tagKey: tagKey
    };
  });
}

function getTagRegExp(tag, sourceExt, opt, sourcePath) {
  tag = makeWhiteSpaceOptional(escapeStringRegexp(tag));
  tag = replaceVariables(tag, {
    name: opt.name,
    path: sourcePath,
    ext: sourceExt === '{{ANY}}' ? '.+' : sourceExt
  });
  return new RegExp(tag, 'ig');
}

function replaceVariables(str, variables) {
  return Object.keys(variables).reduce(function (str, variable) {
    return str.replace(new RegExp(escapeStringRegexp(escapeStringRegexp('{{' + variable + '}}')), 'ig'), variables[variable] + '\\b');
  }, str);
}

function makeWhiteSpaceOptional(str) {
  return str.replace(/\s+/g, '\\s*');
}

function getTagsToInject(files, target, opt) {
  return files.reduce(function transformFile(lines, file, i, files) {
    var filepath = getFilepath(file.file, target, opt);
    var transformedContents = opt.transform(filepath, file.file, i, files.length, target);
    if (typeof transformedContents !== 'string') {
      return lines;
    }
    return lines.concat(transformedContents);
  }, []);
}

function log(message) {
  gutil.log(magenta(PLUGIN_NAME), message);
}

function error(message) {
  return new PluginError(PLUGIN_NAME, message);
}
