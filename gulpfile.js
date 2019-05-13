'use strict'
var gulp = require('gulp');
var requireDir = require('require-dir');
requireDir('gulp-tasks');


gulp.paths = {
    dist: 'dist',
};

var paths = gulp.paths;

gulp.task('default', ['serve']);