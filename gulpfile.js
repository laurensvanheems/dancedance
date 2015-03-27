var gulp = require('gulp'),
    util = require('gulp-util'),
    sass = require('gulp-sass'),
    react = require('gulp-react'),
    rename = require('gulp-rename'),
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
* ReactJS
**/
gulp.task('reactjs', function () {
    return gulp.src('src/assets/javascripts/jsx/*.jsx')
        .pipe(react())
        .pipe(rename({suffix: '.jsx'}))
        .pipe(gulp.dest('src/assets/javascripts'));
});

/**
* Watch
**/
gulp.task('watch', function() {
  gulp.watch('src/assets/stylesheets/*.scss', ['css']);
  gulp.watch('src/assets/javascripts/jsx/*.jsx', ['reactjs']);
});

gulp.task('default', ['css']);


