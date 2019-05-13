'use strict'
var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');
// const del = require('del');




// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function () {

    browserSync.init({
        port: 3000,
        server: "./src",
        ghostMode: false,
        notify: false
    });

    gulp.watch('./src/assets/scss/**/*.scss', ['sass']);
    gulp.watch('./src/assets/**/*.scss').on('change', browserSync.reload);
    gulp.watch('./src/assets/**/*.html').on('change', browserSync.reload);
    gulp.watch('./src/assets/**/*.css').on('change', browserSync.reload);

});

gulp.task('sass', function () {
    // del(['css/*.css', 'css/maps/*.css.map']).then(paths => {
    //     console.log('Deleted files and folders:\n', paths.join('\n'));
    // });
    return gulp.src('./src/assets/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(plumber({
            errorHandler: function (err) {
                notify.onError({
                    title: "Gulp error in " + err.plugin,
                    message: err.toString()
                })(err);
                gutil.beep();
            }
        }))
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./src/assets/css'))
        .pipe(browserSync.stream());
});



gulp.task('sass:watch', function () {
    gulp.watch('./src/assets/scss/**/*.scss');
});



// Static Server without watching scss files
gulp.task('serve:lite', function () {

    browserSync.init({
        server: "./",
        ghostMode: false,
        notify: false
    });

    gulp.watch('**/*.css').on('change', browserSync.reload);
    gulp.watch('**/*.html').on('change', browserSync.reload);
    gulp.watch('js/**/*.js').on('change', browserSync.reload);

});