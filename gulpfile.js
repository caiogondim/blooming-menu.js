var gulp = require('gulp')
var uglify = require('gulp-uglify')
var rename = require('gulp-rename')
var header = require('gulp-header')

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
})
