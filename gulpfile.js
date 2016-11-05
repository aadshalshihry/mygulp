// ref: https://github.com/joellongie/jlgulp/blob/master/gulpfile.js
// name: @joellongie

/*--------------------------------------
|	Required
----------------------------------------*/

var gulp = require('gulp'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	autoprefixer = require('gulp-autoprefixer'),
	browserSync = require('browser-sync'),
	reload = browserSync.reload,
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	del = require('del');

/*---------------------------------------
|	Log Errors
-----------------------------------------*/

function errorlog(err){
	console.log(err.message);
	this.emit('end');
}

/*---------------------------------------
|	Scripts Task
-----------------------------------------*/

gulp.task("scripts", function(){
	return gulp.src(['app/js/**/*.js', '!app/js/**/*.min.js'])
		.pipe(sourcemaps.init())
		.pipe(concat('temp.js'))
		.pipe(uglify())
		.on('error', errorlog)
		.pipe(rename('app.min.js'))
		.pipe(sourcemaps.write('../maps'))
		.pipe(gulp.dest('app/js'))

		.pipe(reload({stream:true}));
});


/*---------------------------------------
|	Styles Task
-----------------------------------------*/

gulp.task("styles", function(){
	gulp.src(['app/scss/style.scss', '!app/js/**/*.min.js'])
		.pipe(sourcemaps.init())
		.pipe(sass({outputStyle: 'compressed'}))
		.on('error', errorlog)
		.pipe(autoprefixer({
			browsers: ['last 3 versions'],
			cascade: false
		}))
		.pipe(sourcemaps.write('../maps'))
		.pipe(gulp.dest('app/css'))

		.pipe(reload({stream:true}));
});

/*---------------------------------------
|	HTML Task
-----------------------------------------*/

gulp.task('html', function(){
    gulp.src('app/**/*.html')
    .pipe(reload({stream:true}));
});


/*---------------------------------------
|	Browser-Sync Task
-----------------------------------------*/
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./app/"
        }
    });
});



// task to run build server for testing final app
gulp.task('build:serve', function() {
    browserSync({
        server: {
            baseDir: "./build/"
        }
    });
});


// ////////////////////////////////////////////////
// Build Tasks
// // /////////////////////////////////////////////

// clean out all files and folders from build folder
gulp.task('build:cleanfolder', function (cb) {
	del([
		'build/**'
	], cb);
});

// task to create build directory of all files
gulp.task('build:copy', ['build:cleanfolder'], function(){
    return gulp.src('app/**/*/')
    .pipe(gulp.dest('build/'));
});

// task to removed unwanted build files
// list all files and directories here that you don't want included
gulp.task('build:remove', ['build:copy'], function (cb) {
	del(config.buildFilesFoldersRemove, cb);
});

gulp.task('build', ['build:copy', 'build:remove']);






/*---------------------------------------
|	Watch Task
-----------------------------------------*/

gulp.task ('watch', function(){
	gulp.watch('app/js/**/*.js', ['scripts']);
	gulp.watch('app/scss/**/*.scss', ['styles']);
  	gulp.watch('app/**/*.html', ['html']);
});

/*---------------------------------------
|	Default Task
-----------------------------------------*/

gulp.task('default', ['scripts', 'styles', 'html', "browser-sync", 'watch']);