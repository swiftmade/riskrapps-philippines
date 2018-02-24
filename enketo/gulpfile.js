var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var notify = require('gulp-notify');
var uglify = require('gulp-uglify');
var flatten = require('gulp-flatten');
var replace = require('gulp-replace');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

gulp.task('vendor-fixes', function() {
    return gulp.src('node_modules/enketo-core/src/widget/**/*.scss')
        .pipe(replace(/["^](.*)\/node_modules/g, '"node_modules'))
        .pipe(gulp.dest('node_modules/enketo-core/src/widget'));
});

gulp.task('sass', function() {
    return gulp.src('node_modules/enketo-core/src/sass/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(flatten())
        .pipe(gulp.dest('../www/build/css'))
        .pipe(notify('Sass Compiled'));
});

gulp.task('style', ['vendor-fixes', 'sass']);

gulp.task('browserify-app', function() {
    //
    return browserify('src/js/enketo.webform.js')
        .bundle()
        .on('error', function(err) {
            console.error(err);
        })
        .pipe(source('enketo-bundle.js'))
        .pipe(gulp.dest('./www/build/js/'))
        .pipe(notify("Browserified!"));
});

gulp.task('browserify-submissions', function() {
    //
    return browserify('src/js/submissions.js')
        .bundle()
        .pipe(source('submissions-bundle.js'))
        .pipe(gulp.dest('./www/build/js/'));
});

gulp.task('browserify-localization', function() {
    return browserify('src/js/modules/i18n/i18n.js')
        .bundle()
        .pipe(source('i18n-bundle.js'))
        .pipe(gulp.dest('./www/build/js/'));
})

gulp.task('uglify', function() {
    return gulp.src('../www/build/js/enketo-bundle.js')
        .pipe(uglify())
        .pipe(gulp.dest('../www/build/js'));
});

gulp.task('watch', function() {
    /*
    watch('src/sass/** / *.scss', function() {
        gulp.start('style');
    });
    */
    watch(['src/**/*.js'], function() {
        gulp.start(['browserify-app', 'browserify-submissions', 'browserify-localization']);
    });
});

gulp.task('compile', ['browserify-localization', 'browserify-app', 'browserify-submissions']);
gulp.task('bump', function () {
   require('gulp-cordova-bump').run({autofiles: true});
});
gulp.task('build', [
    'compile',
    // TODO: Fix sass build pipelineg
    //'style'
]);

gulp.task('dev', ['build', 'watch']);
gulp.task('default', ['build']);