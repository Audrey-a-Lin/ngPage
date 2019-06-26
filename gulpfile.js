var gulp = require('gulp'),
	compass = require('gulp-compass'),
	browserSync = require('browser-sync').create();

//Compile scss file into css
gulp.task('style',function(done){
	gulp.src('./src/scss/*.scss')
		.pipe(compass({
			config_file: './config.rb',
		    css: './dist/css/',
		    sass: './src/scss/'
		}))
		.pipe(gulp.dest('./dist/css/'));
	done();
});

// Move js file to output folder
gulp.task('js',function(done){
	gulp.src('./src/js/*.js')
		.pipe(gulp.dest('./dist/js/'));
	done();
});

// Active browser-sync plugin and rebuild file 

gulp.task('serve', gulp.series('style', 'js', function() {
	browserSync.init({
		online: false,// Will not generate external URL
		cors: true,
		startPath: 'examples/index.html',
		file: ['./src/'],
		server: {
            baseDir: ['./'],
            index:'index.html' ,
            routers: {
            	'examples/': 'examples',
            	'dist/': 'dist'
            }

        }

	});

	// Watch js files
	gulp.watch(['./src/js/*.js','./examples/*js'],gulp.series('js'));
	// Watch scss files
	gulp.watch('./src/scss/*.scss',gulp.series('style'));
	// Refresh browserSync
	gulp.watch(['./src/js/*.js',
				'./src/scss/*.scss',
				'./examples/*']).on('change',browserSync.reload);
}));