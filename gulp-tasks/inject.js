'use strict'
var gulp = require('gulp');
var injectPartials = require('gulp-inject-partials');
var inject = require('gulp-inject');
var rename = require('gulp-rename');
var prettify = require('gulp-prettify');
var replace = require('gulp-replace');
var runSequence = require('run-sequence');



/*sequence for injecting partials and replacing paths*/
gulp.task('inject', function () {
    runSequence('injectPartial', 'injectAssets', 'html-beautify', 'replacePath');
});



/* inject partials like sidebar and navbar */
gulp.task('injectPartial', function () {
    return gulp.src("./**/*.html", {
            base: "./"
        })
        .pipe(injectPartials())
        .pipe(gulp.dest("."));
});



/* inject Js and CCS assets into HTML */
gulp.task('injectAssets', function () {
    return gulp.src('./**/*.html')
        .pipe(inject(gulp.src([
            './src/assets/vendors/iconfonts/mdi/css/materialdesignicons.min.css',
            './src/assets/vendors/iconfonts/ionicons/css/ionicons.css',
            './src/assets/vendors/iconfonts/typicons/src/font/typicons.css',
            './src/assets/vendors/iconfonts/flag-icon-css/css/flag-icon.min.css',
            './src/assets/vendors/css/vendor.bundle.base.css',
            './src/assets/vendors/css/vendor.bundle.addons.css',
            './src/assets/vendors/js/vendor.bundle.base.js',
            './src/assets/vendors/js/vendor.bundle.addons.js'
        ], {
            read: false
        }), {
            name: 'plugins',
            relative: true
        }))
        .pipe(inject(gulp.src([
            '!css/horizontal-layouts.css', // <== !
            '!css/horizontal-layouts-2.css', // <== !
            '!css/sidebar-layouts.css', // <== !
            './src/assets/css/*.css',
            './src/assets/js/shared/off-canvas.js',
            './src/assets/js/shared/hoverable-collapse.js',
            './src/assets/js/shared/misc.js',
        ], {
            read: false
        }), {
            relative: true
        }))
        .pipe(gulp.dest('.'));
});



/*replace image path and linking after injection*/
gulp.task('replacePath', function () {
    gulp.src('src/*/*.html', {
            base: "./"
        })
        .pipe(replace('src="assets/images/', 'src="../assets/images/'))
        .pipe(replace('href="pages/', 'href="pages/'))
        .pipe(replace('href="docs/', 'href="../docs/'))
        .pipe(replace('href="demo_1/', 'href="../demo_1/'))
        .pipe(replace('href="index.html"', 'href="index.html"'))
        .pipe(gulp.dest('.'));
    gulp.src('src/*/pages/*.html', {
            base: "./"
        })
        .pipe(replace('src="assets/images/', 'src="../../assets/images/'))
        .pipe(replace('href="pages/', 'href="../pages/'))
        .pipe(replace('href="pages/', 'href="../../pages/'))
        .pipe(replace('href="docs/', 'href="../../docs/'))
        .pipe(replace('href="demo_1/', 'href="../../demo_1/'))
        .pipe(replace('href="index.html"', 'href="../index.html"'))
        .pipe(gulp.dest('.'));
    gulp.src('src/*/pages/*/*.html', {
            base: "./"
        })
        .pipe(replace('src="assets/images/', 'src="../../../assets/images/'))
        .pipe(replace('href="pages/', 'href="../../pages/'))
        .pipe(replace('href="docs/', 'href="../../../docs/'))
        .pipe(replace('href="demo_1/', 'href="../../../demo_1/'))
        .pipe(replace('href="index.html"', 'href="../../index.html"'))
        .pipe(gulp.dest('.'));
});



gulp.task('html-beautify', function () {
    return gulp.src('src/*/**/*.html')
        .pipe(prettify({
            unformatted: ['pre', 'code', 'textarea']
        }))
        .pipe(gulp.dest(function (file) {
            return file.base;
        }));
});