'use strict'
var gulp = require('gulp');
var concat = require('gulp-concat');
var merge = require('merge-stream');
var runSequence = require('run-sequence');



/*sequence for building vendor scripts and styles*/
gulp.task('bundleVendors', function () {
    runSequence('copyRecursiveVendorFiles', 'buildBaseVendorStyles', 'buildBaseVendorScripts', 'buildOptionalVendorStyles', 'buildOptionalVendorScripts');
});



/* Copy whole folder of some specific node modules that are calling other files internally */
gulp.task('copyRecursiveVendorFiles', function () {
    var mdi = gulp.src(['./node_modules/@mdi/font/**/*'])
        .pipe(gulp.dest('./src/assets/vendors/iconfonts/mdi'));
    var feathericon = gulp.src(['./node_modules/puse-icons-feather/**/*'])
        .pipe(gulp.dest('./src/assets/vendors/iconfonts/puse-icons-feather'));
    var fontawesome = gulp.src(['./node_modules/font-awesome/**/*'])
        .pipe(gulp.dest('./src/assets/vendors/iconfonts/font-awesome'));
    var flagicon = gulp.src(['./node_modules/flag-icon-css/**/*'])
        .pipe(gulp.dest('./src/assets/vendors/iconfonts/flag-icon-css'));
    return merge(
        mdi,
        feathericon,
        fontawesome,
        flagicon
    );
});



/*Building vendor scripts needed for basic template rendering*/
gulp.task('buildBaseVendorScripts', function () {
    return gulp.src([
            './node_modules/jquery/dist/jquery.min.js',
            './node_modules/popper.js/dist/umd/popper.min.js',
            './node_modules/bootstrap/dist/js/bootstrap.min.js',
            './node_modules/perfect-scrollbar/dist/perfect-scrollbar.min.js'
        ])
        .pipe(concat('vendor.bundle.base.js'))
        .pipe(gulp.dest('./src/assets/vendors/js'));
});



/*Building vendor styles needed for basic template rendering*/
gulp.task('buildBaseVendorStyles', function () {
    return gulp.src(['./node_modules/perfect-scrollbar/css/perfect-scrollbar.css'])
        .pipe(concat('vendor.bundle.base.css'))
        .pipe(gulp.dest('./src/assets/vendors/css'));
});



/*Building optional vendor scripts for addons*/
gulp.task('buildOptionalVendorScripts', function () {
    return gulp.src([
            'node_modules/chart.js/dist/Chart.min.js',
            'node_modules/jvectormap/jquery-jvectormap.min.js',
            'node_modules/jvectormap/tests/assets/jquery-jvectormap-world-mill-en.js',
            'node_modules/justgage/raphael-2.1.4.min.js',
            'node_modules/justgage/justgage.js',
        ])
        .pipe(concat('vendor.bundle.addons.js'))
        .pipe(gulp.dest('./src/assets/vendors/js'));
});



/*Building optional vendor styles for addons*/
gulp.task('buildOptionalVendorStyles', function () {
    return gulp.src([
            'node_modules/jvectormap/jquery-jvectormap.css',
        ])
        .pipe(concat('vendor.bundle.addons.css'))
        .pipe(gulp.dest('./src/assets/vendors/css'));
});