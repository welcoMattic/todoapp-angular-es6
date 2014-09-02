'use strict';

require('object.assign');

var format = require('util').format;

var bach = require('bach');
var browserify = require('browserify');
var defsify = require('browserify-defs');
var es6ify = require('es6ify');
var mainBowerFiles = require('main-bower-files');
var ngAnnotatify = require('browserify-ngannotate');
var source = require('vinyl-source-stream');
var wiredep = require('wiredep');

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();

var htmlminOptions = require('./htmlmin-config.json');

var build = bach.series(lint, clean, bach.parallel(scripts, styles, vendors), html, function () {
  return size('dist/**/*');
});

function clean() {
  return gulp.src(['.tmp', 'dist'])
    .pipe(plugins.rimraf());
}

function lint() {
  return gulp.src('app/**/*.js')
    .pipe(plugins.cache(plugins.jshint()))
    .pipe(plugins.jshint.reporter('jshint-stylish'));
}

function cleanScripts() {
  return gulp.src(['.tmp/app.js', '.tmp/app.js.map', 'dist/app.js'])
    .pipe(plugins.rimraf());
}

function scripts() {
  var traceurOptions = require('./traceur-config.json');

  Object.assign(es6ify.traceurOverrides, traceurOptions);

  return browserify({ debug: true })
    .add('./app/app.js')
    .transform(es6ify)
    .transform(defsify)
    .transform(ngAnnotatify)
    .bundle()
    .pipe(source('app.js'))
    .pipe(plugins.buffer())
    .pipe(plugins.sourcemaps.init({ loadMaps: true }))
      .pipe(plugins.sourcemaps.write('./'))
    .pipe(gulp.dest('.tmp'))
    .pipe(plugins.ignore.exclude('*.map'))
    .pipe(plugins.stripDebug())
    .pipe(plugins.uglify())
    .pipe(gulp.dest('dist'));
}

function cleanStyles() {
  return gulp.src(['.tmp/app.css', '.tmp/app.css.map', 'dist/app.css'])
    .pipe(plugins.rimraf());
}

function styles() {
  return gulp.src('app/**/*.css')
    .pipe(plugins.sourcemaps.init())
      .pipe(plugins.cache(plugins.autoprefixer('last 2 version', '> 1%', 'ie 8')))
      .pipe(plugins.sourcemaps.write('./'))
    .pipe(gulp.dest('.tmp'))
    .pipe(plugins.ignore.exclude('*.map'))
    .pipe(plugins.cache(plugins.csso()))
    .pipe(plugins.concat('app.css'))
    .pipe(gulp.dest('dist'));
}

function cleanVendors() {
  return gulp.src('dist/vendors.{js,css}')
    .pipe(plugins.rimraf());
}

function vendors() {
  var jsFilter = plugins.filter('*.js');
  var cssFilter = plugins.filter('*.css');

  return gulp.src(mainBowerFiles())
    .pipe(jsFilter)
      .pipe(plugins.cache(plugins.uglify()))
      .pipe(plugins.concat('vendors.js'))
      .pipe(gulp.dest('dist'))
      .pipe(jsFilter.restore())
    .pipe(cssFilter)
      .pipe(plugins.cache(plugins.csso()))
      .pipe(plugins.concat('vendors.css'))
      .pipe(gulp.dest('dist'))
      .pipe(cssFilter.restore());
}

function cleanHtml() {
  return gulp.src(['.tmp/index.html', 'dist/index.html'])
    .pipe(plugins.rimraf());
}

function html() {
  return gulp.src('app/index.html')
    .pipe(wiredep.stream({ ignorePath: '../bower_components' }))
    .pipe(plugins.inject(gulp.src('app/**/*.css', { read: false }), {
      ignorePath: 'app'
    }))
    .pipe(plugins.inject(templates(), {
      ignorePath: 'app/',
      starttag: '<!-- inject:templates -->',
      transform: function (filepath, file) {
        return format('<script type="text/ng-template" id="%s">%s</script>',
          file.relative, file.contents.toString('utf8'));
      }
    }))
    .pipe(gulp.dest('.tmp'))
    .pipe(plugins.useref())
    .pipe(plugins.cache(plugins.htmlmin(htmlminOptions)))
    .pipe(gulp.dest('dist'));
}

function templates() {
  return gulp.src(['app/**/*.html', '!app/index.html'])
    .pipe(plugins.cache(plugins.htmlmin(htmlminOptions)));
}

function size(pattern) {
  return gulp.src(pattern)
    .pipe(plugins.size());
}

function serve() {
  return gulp.src(['.tmp', 'bower_components'])
    .pipe(plugins.webserver({ port: process.env.PORT || 3000, open: true }));
}

gulp.task('clean', clean);

gulp.task('lint', lint);

gulp.task('clean:scripts', cleanScripts);
gulp.task('scripts', bach.series(lint, cleanScripts, scripts, function () {
  return size('dist/app.js');
}));

gulp.task('clean:styles', cleanStyles);
gulp.task('styles', bach.series(cleanStyles, styles, function () {
  return size('dist/app.css');
}));

gulp.task('clean:vendors', cleanVendors);
gulp.task('vendors', bach.series(cleanVendors, vendors, function () {
  return size('dist/vendors.{js,css}');
}));

gulp.task('clean:html', cleanHtml);
gulp.task('html', bach.series(cleanHtml, html, function () {
  return size('dist/index.html');
}));

gulp.task('build', build);

gulp.task('serve', serve);

gulp.task('default', bach.series(build, serve));
