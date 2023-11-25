var argv = require('yargs').argv;
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jslint = require('gulp-jslint-simple');
var reporter = require('jshint-stylish').reporter;
var defineModule = require('gulp-define-module');
var jsonTransform = require('gulp-json-transform');

gulp.task('code-quality', function () {
  gulp.src('./app/**/*.js')
    .pipe(jshint({expr: true}))
    .pipe(jshint.reporter(reporter));
});

//USAGE: gulp set-env-config -e "local"
gulp.task('set-env-config', function () {    
  gulp.src('./appConfig.json')    
    .pipe(jsonTransform(function(data) {        
            return data[argv.e];
    }))
    .pipe(defineModule('node'))
    .pipe(gulp.dest('./app/global/config/'))
});

//USAGE: gulp copy-client -p "C:/_Rishi/venture/aws/cloud-school_launch-pad/CloudSchool/"
gulp.task('copy-stream-api', function () {
    gulp.src('./**')
        .pipe(gulp.dest(argv.p));
});
