var gulp = require('gulp')
var uglify = require('gulp-uglify')
var rename = require('gulp-rename')
var header = require('gulp-header')
var ghPages = require('gulp-gh-pages')
var standard = require('gulp-standard')

// Test
// ----

gulp.task('js-standard', function () {
  return gulp.src(['src/index.js', './test/**', 'gulpfile.js'])
    .pipe(standard())
    .pipe(standard.reporter('default', {breakOnError: true}))
})

gulp.task('test', ['js-standard'])

// Build
// -----

var pkg = require('./package.json')
var banner = [
  '/**',
  ' * <%= pkg.name %> - <%= pkg.description %>',
  ' *',
  ' * @version v<%= pkg.version %>',
  ' * @link <%= pkg.homepage %>',
  ' * @author <%= pkg.author %>',
  ' * @license <%= pkg.license %>',
  ' */',
  ''].join('\n')

gulp.task('build', function () {
  return gulp.src('src/*')
    .pipe(uglify())
    .pipe(header(banner, {pkg: pkg}))
    .pipe(rename('blooming-menu.min.js'))
    .pipe(gulp.dest('build'))
    .pipe(gulp.dest('example/js'))
})

// Deploy
// ------

gulp.task('deploy:ghpages', function () {
  gulp
    .src('./build/blooming-menu.min.js')
    .pipe(gulp.dest('./example/js'))

  return gulp
    .src('./example/**/*')
    .pipe(ghPages())
})
