"use strict";

// Load plugins
const gulp         = require('gulp');
const concat       = require("gulp-concat");
const rename       = require("gulp-rename");
const terser       = require('gulp-terser');
const sourcemaps   = require("gulp-sourcemaps");
const autoprefixer = require("gulp-autoprefixer");
const sass         = require("gulp-sass");
const sassLint     = require('gulp-sass-lint');
const eslint       = require("gulp-eslint");

// File paths to various assets are defined here.
const PATHS = {
  sass: [
    'assets/scss/*.scss',
    'assets/scss/**/*.scss'
  ],
  jsVendor: [
    'assets/js/vendor/*.js'
  ],
  jsProject: [
    'assets/js/scripts/*.js',
    'assets/js/scripts.js'
  ]
};

// Concatenate & Minify all bower dependency javascript files
function buildScriptsVendor() {
  return (
    gulp
      .src(PATHS.jsVendor)
      .pipe(concat('vendor.js'))
      .pipe(rename({
        suffix: '.min'
      }))
      .pipe(terser())
      .pipe(gulp.dest('build/js'))
  );
}

// Concatenate & Minify all project javascript files
function buildScriptsProject() {
  return (
    gulp
      .src(PATHS.jsProject)
      .pipe(concat('scripts.js'))
      .pipe(rename({
        suffix: '.min'
      }))
      .pipe(terser())
      .pipe(gulp.dest('build/js'))
  );
}

// Concatenate all project javascript files
function devScriptsProject() {
  return (
    gulp
      .src(PATHS.jsProject)
      .pipe(concat('scripts.js'))
      .pipe(gulp.dest('build/js'))
  );
}

// run JS lint on project scripts
function scriptsLint() {
  return gulp
    .src(PATHS.jsProject)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

// Compile min CSS
function buildStyles() {
  return (
    gulp
      .src('assets/scss/main.scss')
      .pipe(sourcemaps.init())
      .pipe(sass({
        includePaths: PATHS.sass,
        outputStyle: 'compressed'
      }))
      .pipe(autoprefixer())
      .pipe(rename({
        basename: "styles",
        suffix: '.min'
      }))
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('build/css'))
  );
}

// run SCSS lint on project styles
function stylesLint() {
  return (
    gulp
      .src(PATHS.sass)
      .pipe(sassLint())
      .pipe(sassLint.format())
      .pipe(sassLint.failOnError())
  );
}

// Watch files
function watchDevFiles() {
  gulp.watch(PATHS.sass, gulp.series(stylesLint, buildStyles));
  gulp.watch(PATHS.jsProject, gulp.series(scriptsLint, devScriptsProject));
}

// Watch files
function watchFiles() {
  gulp.watch(PATHS.sass, gulp.series(stylesLint, buildStyles));
  gulp.watch(PATHS.jsProject, gulp.series(scriptsLint, buildScriptsProject));
}

// define complex tasks
const js    = gulp.series(scriptsLint, gulp.parallel(buildScriptsProject, buildScriptsVendor));
const build = gulp.series(scriptsLint, stylesLint, gulp.parallel(buildScriptsVendor, buildScriptsProject, buildStyles));
const dev   = gulp.series(scriptsLint, stylesLint, gulp.parallel(buildScriptsVendor, devScriptsProject, buildStyles));

// export tasks
exports.vendor      = buildScriptsVendor;
exports.project     = buildScriptsProject;
exports.projectDev  = devScriptsProject;
exports.styles      = buildStyles;
exports.scriptsLint = scriptsLint;
exports.sassLint    = stylesLint;
exports.watchDev    = watchDevFiles;
exports.watch       = watchFiles;
exports.js          = js;
exports.build       = build;
exports.dev         = dev;
exports.default     = build;
