var gulp = require('gulp')
var uglify = require('gulp-uglify')
var rename = require('gulp-rename')

gulp.task('build', function () {
  return gulp.src('src/*')
    .pipe(uglify())
    .pipe(rename('blooming-menu.min.js'))
    .pipe(gulp.dest('build'))
})
