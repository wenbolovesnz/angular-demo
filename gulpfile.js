var express = require('express'),
exec = require('child_process').exec,
mainBowerFiles = require('main-bower-files'),
gulp = require('gulp'),
concat = require('gulp-concat'),
rimraf = require('rimraf'),
livereload = require('gulp-livereload'),
gulpif = require('gulp-if'),
jade = require('gulp-jade')
nodemon = require('gulp-nodemon'),
stylus = require('gulp-stylus'),
rename = require('gulp-rename'),
gulpUtil = require('gulp-util'),
uglify = require('gulp-uglify'),
watch = require('gulp-watch'),
plumber = require('gulp-plumber'),
path = require('path');
runSequence = require('run-sequence'),
streamqueue = require('streamqueue'),
through2 = require('through2'),
nib = require('nib');

var paths = {}, 
config = {
  server_port : 3000,
  livereload_port : 35729
};

gulp.task('path', function(){
  paths = {
    style : 'style',
    app : 'app',
    dest : '.dist',
    bower: 'bower_components'
  }
});

gulp.task('build-version', function(cb){
  exec("git describe --tags --always --long --dirty", function(error, stdout, stderr) { 
    if (error) { throw Error(error); }
    config.buildVersion = stdout.replace(/\n$/, '');
    cb();
  });
});

gulp.task('clean', function(cb){
  rimraf(paths.dest, cb);
});

gulp.task('bower', function(cb){
  config.lib = mainBowerFiles({ base: paths.bower })
  .map(function(str){
    return str.substr(__dirname.length);
  });
  cb();
});

gulp.task('js', function(){
  if(config.dev){
    return gulp.src(paths.app + '/**/*.js')
    .pipe(plumber())
    .pipe(gulp.dest(paths.dest))
    .pipe(gulpUtil.buffer(function (err, files){
      config.js = files.map(function(file){
        return file.path.substr(file.base.length + 1);
      });
    }))
    .pipe(livereload());  
  }else{

  }
  
});

gulp.task('style', function(){
  return gulp.src(paths.style + '/style.styl')
  .pipe(plumber())
  .pipe(stylus({
    use: nib(),
    compress: !config.dev
  }))
  .pipe(gulp.dest(paths.dest + '/css'))
  .pipe(livereload());
});

gulp.task('jade', function(){
  if(config.dev){
    return gulp.src(paths.app + '/**/*.jade')
    .pipe(plumber())
    .pipe(jade({
      pretty : true,
      locals : config
    }))
    .pipe(rename({
      dirname : ''
    }))
    .pipe(gulp.dest(paths.dest))
    .pipe(livereload());
  }
});


gulp.task('static-server', function(cb){
  var app = express();
  app.use(express.static(path.join(__dirname, paths.dest)));
  app.use('/bower_components', express.static(path.join(__dirname, paths.bower)));
  var server = app.listen(config.server_port, function(){
    gulpUtil.log('static server listen at', gulpUtil.colors.cyan(config.server_port));
    gulpUtil.log('open http://localhost:' + gulpUtil.colors.cyan(config.server_port), 'in your browser');
  });
  cb();
});

gulp.task('watchs', function(cb){
  watch([
    paths.style + '/**/*.styl',
    paths.app + '/**/*.styl'
  ], runTask('style'));
  watch(paths.app + '/**/*.jade', runTask('jade'));
  watch(paths.app + '/**/*.js', runTask('js'));
  cb();
});

gulp.task('build', function(){
  config.dev = false;
  runSequence(
    'path', 
    'clean', 
    ['bower', 'style', 'js', 'build-version'], 
    'jade',
    cb
  ); 
});

gulp.task('dev', function(cb){
  config.dev = true;
  livereload.listen(config.livereload_port);
  runSequence(
    'path', 
    'clean', 
    ['bower', 'style', 'js', 'build-version'], 
    'jade', 
    ['watchs', 'static-server'], 
    cb
  ); 
});


function runTask(task){
  return function(content, cb){
    gulp.start(task, cb);
  }
}