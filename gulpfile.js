var gulp = require('gulp');

var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var sass = require('gulp-sass');
var imagemin = require('gulp-imagemin');

// Combine all js plugins from src folder
gulp.task('concat-plugins', function() {
  gulp.src('assets/js/src/plugins/*.js')
    .pipe(concat('plugins.js'))
    .pipe(gulp.dest('assets/js/src/'));
});

// Compress all js files and combine in one file
gulp.task('minify-js', function() {
  gulp.src(['assets/js/src/plugins.js', 'assets/js/src/main.js'])
    .pipe(concat('all.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('assets/js/'));
});

// Do magic on CSS
gulp.task('css', function() {
  gulp.src(['assets/scss/main.scss'])
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(minifyCSS({}))
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('assets/css/'));
});

// Optimize images and svgs
gulp.task('imagemin', function() {
    gulp.src('assets/images/src/**/*')
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{ removeUselessStrokeAndFill: false }]
    }))
    .pipe(gulp.dest('assets/images/'));
});

// Default task
gulp.task('default', ['concat-plugins', 'minify-js', 'css', 'imagemin']);

// Track changes in important folders
gulp.task('watcher', function() {
    var watcherJSplugins = gulp.watch('assets/js/src/plugins/*.js', ['concat-plugins']);
    var watcherJS = gulp.watch(['assets/js/src/plugins.js', 'assets/js/src/main.js'], ['minify-js']);
    var watcherCSS = gulp.watch('assets/scss/**/*.scss', ['css']);
    var watcherImages = gulp.watch('assets/images/src/**/*', ['imagemin']);
});