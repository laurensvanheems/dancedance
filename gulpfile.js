var gulp = require('gulp'),
    util = require('gulp-util'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer');

/**
* CSS
**/
gulp.task('css', function() {
  return gulp.src('src/assets/stylesheets/*.scss')
    .pipe(sass({
      precision: 10,
      onError: util.log
    }))
    .pipe(autoprefixer())
    .pipe(gulp.dest('src/assets/stylesheets'));
});

/**
* Watch
**/
gulp.task('watch', function() {
  return gulp.watch(['src/assets/stylesheets/*.scss'], ['css']);
});

gulp.task('default', ['css']);
