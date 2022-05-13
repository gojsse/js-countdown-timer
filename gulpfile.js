"use strict";

// Load plugins
const gulp         = require('gulp');
const autoprefixer = require("gulp-autoprefixer");
const sass         = require("gulp-sass");
const sassLint     = require('gulp-sass-lint');
const rename       = require("gulp-rename");
const sourcemaps   = require("gulp-sourcemaps");
const buffer       = require('vinyl-buffer');
const source       = require('vinyl-source-stream');
const rollup       = require('rollup-stream');
const uglify       = require('rollup-plugin-uglify-es');
const babel        = require('rollup-plugin-babel');
const { eslint }   = require('rollup-plugin-eslint');

// File paths to various assets are defined here.
const PATHS = {
  sass: [
    'assets/scss/*.scss',
    'assets/scss/**/*.scss'
  ],
  jsProject: [
    'assets/js/*.js'
  ]
};

const rollupJS = (inputFile, options) => {
  return rollup({
    input: options.basePath + inputFile,
    format: options.format,
    sourcemap: options.sourcemap,
    plugins: options.plugins
  })
  // point to the entry file.
  .pipe(source(inputFile, options.basePath))
  // we need to buffer the output, since many gulp plugins don't support streams.
  .pipe(buffer())
  .pipe(sourcemaps.init({loadMaps: true}))
  // some transformations like uglify, rename, etc.
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(options.distPath));
};

// Concatenate & Minify all project javascript files
const buildScripts = function () {
  return rollupJS('scripts.js', {
    basePath: './assets/js/',
    format: 'es',
    distPath: './build/js',
    sourcemap: true,
    plugins: [
      eslint(),
      babel({ exclude: 'node_modules/**' }),
      uglify()
    ]
  });
}

// Compile min CSS
const buildStyles = function() {
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

// Run SCSS lint on project styles
const stylesLint = function() {
  return (
    gulp
      .src(PATHS.sass)
      .pipe(sassLint())
      .pipe(sassLint.format())
      .pipe(sassLint.failOnError())
  );
}

// Watch files
const watchFiles = function() {
  gulp.watch(PATHS.sass, gulp.series(stylesLint, buildStyles));
  gulp.watch(PATHS.jsProject, buildScripts);
}

// Define complex tasks
const build = gulp.series(stylesLint, buildStyles, buildScripts);

// Export tasks
exports.project  = buildScripts;
exports.styles   = buildStyles;
exports.sassLint = stylesLint;
exports.watch    = watchFiles;
exports.build    = build;
exports.default  = build;
