
/**
 * Constants
 */
var DEFAULT_TARGET = 'html';
var DEFAULTS = {
  STARTS: {
    html: '<!-- {{name}}:{{ext}} -->',
    jsx: '{/* {{name}}:{{ext}} */}',
    jade: '//- {{name}}:{{ext}}',
    pug: '//- {{name}}:{{ext}}',
    slm: '/ {{name}}:{{ext}}',
    slim: '/ {{name}}:{{ext}}',
    haml: '-# {{name}}:{{ext}}',
    less: '/* {{name}}:{{ext}} */',
    sass: '/* {{name}}:{{ext}} */',
    scss: '/* {{name}}:{{ext}} */'
  },
  ENDS: {
    html: '<!-- endinject -->',
    jsx: '{/* endinject */}',
    jade: '//- endinject',
    pug: '//- endinject',
    slm: '/ endinject',
    slim: '/ endinject',
    haml: '-# endinject',
    less: '/* endinject */',
    sass: '/* endinject */',
    scss: '/* endinject */'
  }
};

module.exports = function tags() {
  return {
    start: getTag.bind(null, DEFAULTS.STARTS),
    end: getTag.bind(null, DEFAULTS.ENDS)
  };
};

function getTag(defaults, targetExt, sourceExt, defaultValue) {
  var tag = defaultValue;
  if (!tag) {
    tag = defaults[targetExt] || defaults[DEFAULT_TARGET];
  } else if (typeof tag === 'function') {
    tag = tag(targetExt, sourceExt);
  }
  return tag;
}
