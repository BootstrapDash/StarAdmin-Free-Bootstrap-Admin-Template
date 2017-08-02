# [gulp](https://github.com/gulpjs/gulp)-bower-src [![Build Status](https://secure.travis-ci.org/bclozel/gulp-bower-src.png?branch=master)](http://travis-ci.org/bclozel/gulp-bower-src)

> Gulp-src [bower](http://bower.io) components files

`gulp.src` files from your bower components directory, using your `bower.json` configuration file.
Bower expects package maintainers to add `"ignore"` attributes to their JSON
(see [reference](http://bower.io/#defining-a-package)), so you don't have to pull all files from dependencies.

`"ignore"` attributes aren't always set - gulp-bower-src also get that information from your local `overrides`, which
is currently [under discussion in the bower community](https://github.com/bower/bower/issues/585).

For the time being, this gulp plugin does not support negate glob patterns in ignore.
See issue [isaacs/node-glob#62](https://github.com/isaacs/node-glob/issues/62).


## Install

Install with [npm](https://npmjs.org/package/gulp-bower-src)

```
npm install --save-dev gulp-bower-src
```

## Overriding ignores in your bower.json

```js
{
    "name": "myapp",
    "description": "My wonderful application",
    "dependencies": {
        "foo": "~2.1",
        "bar": "~1.0",
        "baz": "*"
    },
    "overrides": {
        "foo": {
            "ignore": ["test/**"]
        },
        "bar": {
            "ignore": ["dist/**", "src/**"]
        }
    }
}
```

## Examples

Simply copy resources to `dist/lib`

```js
var gulp = require('gulp');
var bowerSrc = require('gulp-bower-src');

gulp.task('default', function () {
	bowerSrc()
		.pipe(gulp.dest('dist/lib'));
});
```

Copy resources to `dist/lib` and uglify non-minified JavaScript files on the fly

```js
var gulp = require('gulp');
var filter = require('gulp-filter');
var bowerSrc = require('gulp-bower-src');
var uglify = require('gulp-uglify');

var filter = gulpFilter('**/*.js', '!**/*.min.js');

gulp.task('default', function () {
	bowerSrc()
		.pipe(filter)
		.pipe(uglify())
		.pipe(filter.restore())
		.pipe(gulp.dest('dist/lib'));
});
```
