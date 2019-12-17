// Include gulp
var $ = require('gulp-load-plugins')();
var gulp = require('gulp');
var sequence = require('run-sequence');
var sassLint = require('gulp-sass-lint');

function swallowError() {
  console.log('UGLIFY ERROR');
  this.emit('end');
}

/**
 * File paths to various assets are defined here.
 */
var PATHS = {
  sass: [
    'assets/scss/*.scss',
    'assets/scss/**/*.scss'
  ],
  jsVendor: [

  ],
  jsProject: [
    'assets/js/modules/*.js',
    'assets/js/scripts.js'
  ]
};

// Concatenate & Minify all vendor javascript files
gulp.task('build:scripts:vendor', function () {
  return gulp.src(PATHS.jsVendor)
    .pipe($.concat('vendor.js'))
    .pipe($.rename({
      suffix: '.min'
    }))
    .pipe($.uglify().on('error', swallowError))
    .pipe(gulp.dest('build/js'));
});

// Concatenate & Minify all vendor javascript files
gulp.task('dev:scripts:vendor', function () {
  return gulp.src(PATHS.jsVendor)
    .pipe($.concat('vendor.js'))
    .pipe($.rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('build/js'));
});

// Concatenate & Minify all project javascript files
gulp.task('build:scripts:project', function () {
  return gulp.src(PATHS.jsProject)
    .pipe($.concat('scripts.js'))
    .pipe($.rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('build/js'));
});

// Concatenate & Minify all project javascript files
gulp.task('dev:scripts:project', function () {
  return gulp.src(PATHS.jsProject)
    .pipe($.concat('scripts.js'))
    .pipe($.rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('build/js'));
});

// Compile min CSS
gulp.task('build:styles', function () {
  return gulp.src('assets/scss/main.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      includePaths: PATHS.sass,
      outputStyle: 'compressed'
    })
      .on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe($.rename({
      basename: 'styles',
      suffix: '.min'
    }))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('build/css'));
});

// Compile uncompressed CSS
gulp.task('dev:styles', function () {
  return gulp.src('assets/scss/main.scss')
    .pipe($.sass({
      includePaths: PATHS.sass,
      outputStyle: 'expanded',
      indentType: 'tab',
      indentWidth: 1
    })
      .on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe($.rename({
      basename: 'styles',
      suffix: '.min'
    }))
    .pipe(gulp.dest('build/css'));
});

// run JS lint on scripts
gulp.task('lint', function () {
  return gulp.src(PATHS.jsProject)
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failAfterError());
});

// run SCSS lint on styles
gulp.task('sass-lint', function () {
  return gulp.src(PATHS.sass)
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
});

// Watch tasks
gulp.task('watch', function () {
  // Watch .js files
  gulp.watch(PATHS.jsProject, ['build:scripts:project', 'lint']);
  // Watch .scss files
  gulp.watch(PATHS.sass, ['build:styles', 'sass-lint']);
});

// DEV Watch tasks
gulp.task('watch:dev', function () {
  // Watch .js files
  gulp.watch(PATHS.jsProject, ['dev:scripts:project', 'lint']);
  // Watch .scss files
  gulp.watch(PATHS.sass, ['dev:styles', 'sass-lint']);
});

// Build and minify the assets
gulp.task('build', function (done) {
  sequence([
    'lint',
    'build:scripts:vendor',
    'build:scripts:project',
    'sass-lint',
    'build:styles'
  ], done);
});

// Build the assets un-minified
gulp.task('dev', function (done) {
  sequence([
    'lint',
    'dev:scripts:vendor',
    'dev:scripts:project',
    'sass-lint',
    'dev:styles'
  ], done);
});

// Default task, run the build
gulp.task('default', ['build']);
