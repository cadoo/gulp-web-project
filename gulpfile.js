// ----- Define workers -----

var gulp             = require('gulp');
var livereload       = require('gulp-livereload');
var sourcemaps       = require('gulp-sourcemaps');
var postcss          = require('gulp-postcss');
var atImport         = require('postcss-import');
var customMedia      = require('postcss-custom-media');
var customProperties = require('postcss-custom-properties');
var simpleExtend     = require('postcss-extend');
var autoprefixer     = require('autoprefixer');
var nano             = require('gulp-cssnano');
var uglify           = require('gulp-uglify');
var rename           = require('gulp-rename');
var concat           = require('gulp-concat');
var svgSprite        = require('gulp-svg-sprite');
var rsp              = require('remove-svg-properties').stream;


// ----- Tasks -----

// SVG icons
gulp.task('svg-icons', function() {
  var config = {
    mode: {
      symbol: { // symbol mode to build the SVG
        render: {
          css: {
            dest: '../css/src/_sprites'
          }
        },
        inline: false,
        dest: '.', // destination folder
        prefix: '.icon--',
        dimensions: '%s',
        sprite: 'sprite.svg', // generated sprite name
        example: true // build a sample page
      }
    }
  };
  gulp.src('assets/icons/src/**/*.svg')
    .pipe(rsp.remove({
      properties: [rsp.PROPS_FILL] // Remove fill from svg files so they can be styled with CSS
    }))
    .pipe(svgSprite(config))
    .pipe(gulp.dest('assets/icons/'));
});

// SVG images
gulp.task('svg-images', function() {
  var config = {
    mode: {
      symbol: { // symbol mode to build the SVG
        render: {
          css: {
            dest: '../css/src/_sprites-images'
          }
        },
        inline: false,
        dest: '.', // destination folder
        prefix: '.svg--',
        dimensions: '%s',
        sprite: 'sprite-images.svg', // generated sprite name
        example: false // build a sample page
      }
    }
  };
  gulp.src('assets/images/src/**/*.svg')
    .pipe(svgSprite(config))
    .pipe(gulp.dest('assets/images/'));
});

// Combine all js plugins from src folder
gulp.task('concat-plugins', function() {
  gulp.src('assets/js/src/lib/*.js')
    .pipe(concat('plugins.js'))
    .pipe(gulp.dest('assets/js/src/'));
});

// Compress all js files and combine in one file
gulp.task('js-minify', function() {
  // Plugins and main script file
  gulp.src(['assets/js/src/plugins.js', 'assets/js/src/main.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('all.js'))
    .pipe(gulp.dest('assets/js/dist/'))
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('assets/js/dist/'))
    .pipe(livereload());
});

// Do magic on CSS
gulp.task('css', function() {
  var processors = [
    atImport,
    customMedia,
    customProperties,
    simpleExtend,
    autoprefixer
  ];
  gulp.src(['assets/css/src/main.css'])
    .pipe(sourcemaps.init())
    .pipe(postcss(processors))
    .pipe(gulp.dest('assets/css/dist/'))
    .pipe(nano())
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('assets/css/dist/'))
    .pipe(livereload());
});


// ----- Console tasks -----

// Default task
gulp.task('default', ['concat-plugins', 'js-minify', 'css']);

// Track changes in important folders
gulp.task('watcher', function() {
  livereload.listen();
  gulp.watch('assets/js/src/lib/*.js', ['concat-plugins']);
  gulp.watch(['assets/js/src/plugins.js', 'assets/js/src/main.js'], ['js-minify']);
  gulp.watch('assets/css/src/*.css', ['css']);
});
