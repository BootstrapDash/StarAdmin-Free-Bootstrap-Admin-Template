"use strict";
var gulp = require("gulp");
var concat = require("gulp-concat");
var merge = require("merge-stream");
const del = require("del");

gulp.task("clean:vendors", function () {
  return del(["src/assets/vendors/**/*"]);
});

/*Building vendor scripts needed for basic template rendering*/
gulp.task("buildBaseVendorScripts", function () {
  return gulp
    .src([
        "./node_modules/jquery/dist/jquery.min.js",
        "./node_modules/popper.js/dist/umd/popper.min.js",
        "./node_modules/bootstrap/dist/js/bootstrap.min.js",
        "./node_modules/perfect-scrollbar/dist/perfect-scrollbar.min.js",
        './node_modules/chart.js/dist/Chart.min.js',
        './node_modules/jvectormap/jquery-jvectormap.min.js',
        './node_modules/jvectormap/tests/assets/jquery-jvectormap-world-mill-en.js',
        './node_modules/justgage/raphael-2.1.4.min.js',
        './node_modules/justgage/justgage.js',
    ])
    .pipe(concat("vendor.bundle.base.js"))
    .pipe(gulp.dest('./src/assets/vendors/js'))
    .pipe(concat('vendor.bundle.addons.js'))
    .pipe(gulp.dest('./src/assets/vendors/js'));
});

/*Building vendor styles needed for basic template rendering*/
gulp.task("buildBaseVendorStyles", function () {
  return gulp
    .src(['./node_modules/perfect-scrollbar/css/perfect-scrollbar.css',
    'node_modules/jvectormap/jquery-jvectormap.css'
])
    .pipe(concat("vendor.bundle.base.css"))
    .pipe(gulp.dest("src/assets/vendors/css"))
    .pipe(concat('vendor.bundle.addons.css'))
    .pipe(gulp.dest('./src/assets/vendors/css'));
});

/*Scripts for addons*/
gulp.task("buildOptionalVendorScripts", function () {
  var aScript1 = gulp
    .src(["node_modules/chart.js/dist/Chart.min.js"])
    .pipe(gulp.dest("src/assets/vendors/chart.js"));

//   var aScript5 = gulp
//     .src(["node_modules/moment/moment.js"])
//     .pipe(gulp.dest("src/assets/vendors/moment"));
//   var aScript23 = gulp
//     .src(["node_modules/pwstabs/assets/jquery.pwstabs.min.js"])
//     .pipe(gulp.dest("src/assets/vendors/pwstabs"));
//   var aScript29 = gulp
//     .src(["node_modules/jquery-file-upload/js/jquery.uploadfile.min.js"])
//     .pipe(gulp.dest("src/assets/vendors/jquery-file-upload"));
//   var aScript30 = gulp
//     .src(["node_modules/jquery-asColor/dist/jquery-asColor.min.js"])
//     .pipe(gulp.dest("src/assets/vendors/jquery-asColor"));
//   var aScript31 = gulp
//     .src(["node_modules/jquery-asGradient/dist/jquery-asGradient.min.js"])
//     .pipe(gulp.dest("src/assets/vendors/jquery-asGradient"));
//   var aScript32 = gulp
//     .src(["node_modules/jquery-asColorPicker/dist/jquery-asColorPicker.min.js"])
//     .pipe(gulp.dest("src/assets/vendors/jquery-asColorPicker"));
//   var aScript34 = gulp
//     .src(["node_modules/moment/min/moment.min.js"])
//     .pipe(gulp.dest("src/assets/vendors/moment"));
//   var aScript38 = gulp
//     .src(["node_modules/typeahead.js/dist/typeahead.bundle.min.js"])
//     .pipe(gulp.dest("src/assets/vendors/typeahead.js"));
//   var aScript39 = gulp
//     .src(["node_modules/select2/dist/js/select2.min.js"])
//     .pipe(gulp.dest("src/assets/vendors/select2"));
//   var aScript40 = gulp
//     .src(["node_modules/codemirror/lib/codemirror.js"])
//     .pipe(gulp.dest("src/assets/vendors/codemirror"));
//   var aScript41 = gulp
//     .src(["node_modules/codemirror/mode/javascript/javascript.js"])
//     .pipe(gulp.dest("src/assets/vendors/codemirror"));
//   var aScript42 = gulp
//     .src(["node_modules/codemirror/mode/shell/shell.js"])
//     .pipe(gulp.dest("src/assets/vendors/codemirror"));
//   var aScript46 = gulp
//     .src(["node_modules/bootstrap-maxlength/bootstrap-maxlength.min.js"])
//     .pipe(gulp.dest("src/assets/vendors/bootstrap-maxlength"));
//   var aScript65 = gulp
//     .src(["node_modules/twbs-pagination/jquery.twbsPagination.min.js"])
//     .pipe(gulp.dest("src/assets/vendors/twbs-pagination"));
//   var ascript71 = gulp
//     .src(["./node_modules/jquery.easing/jquery.easing.min.js"])
//     .pipe(gulp.dest(["src/assets/vendors/jquery.easing"]));
  return merge(
    aScript1,
    // aScript2,
    // aScript5,
    // aScript10,
    // aScript11,
    // aScript12,
    // aScript13,
    // aScript14,
    // aScript15,
    // aScript23,
    // aScript29,
    // aScript30,
    // aScript31,
    // aScript32,
    // aScript34,
    // aScript38,
    // aScript39,
    // aScript40,
    // aScript41,
    // aScript42,
    // aScript46,
    // aScript65,
    // ascript71
  );
});

/*Styles for addons*/
gulp.task("buildOptionalVendorStyles", function () {
  var aStyle1 = gulp
    .src(["./node_modules/@mdi/font/css/materialdesignicons.min.css"])
    .pipe(gulp.dest("src/assets/vendors/mdi/css"));
  var aStyle2 = gulp
    .src(["./node_modules/@mdi/font/fonts/*"])
    .pipe(gulp.dest("src/assets/vendors/mdi/fonts"));
  var aStyle3 = gulp
    .src(["./node_modules/font-awesome/css/font-awesome.min.css"])
    .pipe(gulp.dest("src/assets/vendors/font-awesome/css"));
  var aStyle4 = gulp
    .src(["./node_modules/font-awesome/fonts/*"])
    .pipe(gulp.dest("src/assets/vendors/font-awesome/fonts"));
  var aStyle5 = gulp
    .src(["./node_modules/flag-icon-css/css/flag-icon.min.css"])
    .pipe(gulp.dest("src/assets/vendors/flag-icon-css/css"));
  var aStyle6 = gulp
    .src(["./node_modules/flag-icon-css/flags/**/*"])
    .pipe(gulp.dest("src/assets/vendors/flag-icon-css/flags"));
//   var aStyle7 = gulp
//     .src(["node_modules/jquery-bar-rating/dist/themes/fontawesome-stars.css"])
//     .pipe(gulp.dest("src/assets/vendors/jquery-bar-rating"));
    var aStyle8 = gulp
    .src(["./node_modules/puse-icons-feather/**/*"])
    .pipe(gulp.dest("src/assets/vendors/iconfonts/puse-icons-feather"));

    var aStyle9 = gulp.src(['./node_modules/@mdi/font/**/*'])
        .pipe(gulp.dest('src/assets/vendors/iconfonts/mdi'));
    var aStyle10 = gulp.src(['./node_modules/puse-icons-feather/**/*'])
        .pipe(gulp.dest('src/assets/vendors/iconfonts/puse-icons-feather'));
    var aStyle11 = gulp.src(['./node_modules/font-awesome/**/*'])
        .pipe(gulp.dest('src/assets/vendors/iconfonts/font-awesome'));
    var aStyle12 = gulp.src(['./node_modules/flag-icon-css/**/*'])
        .pipe(gulp.dest('src/assets/vendors/iconfonts/flag-icon-css'));

    var aStyle13 = gulp.src(['./node_modules/@mdi/font/**/*'])
        .pipe(gulp.dest('src/assets/vendors/iconfonts/mdi'));
    var aStyle14 = gulp.src(['./node_modules/puse-icons-feather/**/*'])
        .pipe(gulp.dest('src/assets/vendors/iconfonts/puse-icons-feather'));
    var aStyle15 = gulp.src(['./node_modules/font-awesome/**/*'])
        .pipe(gulp.dest('src/assets/vendors/iconfonts/font-awesome'));   
    var aStyle16 = gulp.src(['./node_modules/flag-icon-css/**/*'])
        .pipe(gulp.dest('src/assets/vendors/iconfonts/flag-icon-css'));  
        
    var aStyle17 = gulp.src(['./node_modules/ionicons/**/*'])
        .pipe(gulp.dest('src/assets/vendors/iconfonts/ionicons')); 
  return merge(
    aStyle1,
    aStyle2,
    aStyle3,
    aStyle4,
    aStyle5,
    aStyle6,
    // aStyle7,
    aStyle8,
    aStyle9,
    aStyle10,
    aStyle11,
    aStyle12,
    aStyle13,
    aStyle14,
    aStyle15,
    aStyle16,
    aStyle17,
  );
});

//Copy essential map files
gulp.task("copyMapFiles", function () {
  var map1 = gulp
    .src("node_modules/bootstrap/dist/js/bootstrap.min.js.map")
    .pipe(gulp.dest("src/assets/vendors/js"));
//   var map2 = gulp
//     .src("node_modules/@mdi/font/css/materialdesignicons.min.css.map")
//     .pipe(gulp.dest("src/assets/vendors/mdi/css"));
//   var map5 = gulp
//     .src(
//       "node_modules/jquery-asColorPicker/dist/jquery-asColorPicker.min.js.map"
//     )
//     .pipe(gulp.dest("src/assets/vendors/jquery-asColorPicker"));
//   var map6 = gulp
//     .src("node_modules/jquery-asColorPicker/dist/css/asColorPicker.min.css.map")
//     .pipe(gulp.dest("src/assets/vendors/jquery-asColorPicker/css"));
//   var map7 = gulp
//     .src("node_modules/jquery-asColor/dist/jquery-asColor.min.js.map")
//     .pipe(gulp.dest("src/assets/vendors/jquery-asColor"));

//   var map8 = gulp
//     .src("node_modules/jquery-bar-rating/dist/jquery.barrating.min.js.map")
//     .pipe(gulp.dest("src/assets/vendors/jquery-bar-rating"));
//   var map9 = gulp
//     .src("node_modules/jquery-asGradient/dist/jquery-asGradient.min.js.map")
//     .pipe(gulp.dest("src/assets/vendors/jquery-asGradient"));

//   var map12 = gulp
//     .src("node_modules/jquery-bar-rating/dist/jquery.barrating.min.js.map")
//     .pipe(gulp.dest("src/assets/vendors/jquery-bar-rating"));
  return merge(map1);
});

/*sequence for building vendor scripts and styles*/
gulp.task(
  "bundleVendors",
  gulp.series(
    "clean:vendors",
    "buildBaseVendorStyles",
    "buildBaseVendorScripts",
    "buildOptionalVendorStyles",
    "buildOptionalVendorScripts",
    "copyMapFiles"
  )
);
