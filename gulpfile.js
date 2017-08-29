var gulp = require('gulp'),

	/*********** File managing ***********/
		copy = require('gulp-copy'),
		rename = require('gulp-rename'),
		clean = require('gulp-clean'),

	/*********** Jade and Pug templating ***********/
		pug = require('gulp-pug'),

	/*********** SASS and SCSS compiling ***********/
		sass = require('gulp-sass'),
		purify = require('gulp-purifycss'),
		postcss = require('gulp-postcss'),
		autoprefixer = require('autoprefixer'),
		cleanCSS = require('gulp-clean-css'),

	/*********** JS concat ***********/
		concat = require('gulp-concat'),
		uglify = require('gulp-uglify'),

	/*********** Jade and Pug templating ***********/
		imagemin = require('gulp-imagemin'),

	/*********** Static server ***********/
		bs = require('browser-sync').create(),

	/*********** Compressing dist files ***********/
		zip = require('gulp-zip'),

	/*********** Piping error handler ***********/
		plumber = require('gulp-plumber'),

	/*********** Path vars ***********/
		viewsSrc = 'cache/views/*.pug',
		viewsCache = 'cache/',
		sassSrc = 'assets/sass/*.sass',
		jsSrc = 'assets/js/*.js',
		imgSrc = 'assets/img/**/*.+(jpg|png|gif|svg)',

		viewsDest = 'dist/',
		sassDest = 'dist/css/',
		jsDest = 'dist/js/',
		imgDest = 'dist/img';

/*********** Caching pug templates ***********/
gulp.task('clean', function () {
	return gulp.src(viewsCache)
		.pipe(clean({
				force: true,
				read: false
			}));
});

gulp.task('copy', ['clean'], function () {
	return gulp.src('views/**/*.pug')
		.pipe(copy(viewsCache));
});

/*********** HTML teplating and compiling ***********/
gulp.task('pug', ['copy'], function () {
	return gulp.src(viewsSrc)
		.pipe(plumber())
		.pipe(pug({
				pretty: false
			}))
		.pipe(gulp.dest(viewsDest));
});

/*********** Styles compiling ***********/
gulp.task('sass', function () {
	return gulp.src(sassSrc)
		.pipe(sass({
				ouputStyle: 'compressed'
			})
		.on('error', sass.logError))
		.pipe(postcss([ autoprefixer () ]))
		.pipe(purify([jsDest + '*.js', viewsDest + '*.html']))
		.pipe(cleanCSS({debug: true}, function(details) {
				console.log(details.name + ': ' + details.stats.originalSize);
				console.log(details.name + ': ' + details.stats.minifiedSize);
			}))
		.pipe(rename(function (path) {
				path.basename += ".min";
			}))
		.pipe(gulp.dest(sassDest))
		.pipe(bs.stream());
});

/*********** Concat JS files ***********/
gulp.task('concat', function () {
	return gulp.src(jsSrc)
		.pipe(concat('functions.js'))
		.pipe(uglify())
		.pipe(rename(function (path) {
						path.basename += ".min";
					}))
		.pipe(gulp.dest(jsDest));
});

/*********** IMG minification ***********/
gulp.task('img', function () {
	return gulp.src(imgSrc)
		.pipe(imagemin([
			imagemin.gifsicle({interlaced: true}),
			imagemin.jpegtran({progressive: true}),
			imagemin.optipng({optimizationLevel: 5}),
			imagemin.svgo({plugins: [{removeViewBox: true}]})
		], {
			verbose: true
		}))
	.pipe(gulp.dest(imgDest));
});

/*********** BrowserSync Serve ***********/
gulp.task('serve', function () {
	bs.init({
		server: {
			baseDir: 'dist/'
		}
	});
});

gulp.task('compress', function () {
	gulp.src(viewsDest)
		.pipe(zip('dist.zip'))
		.pipe(gulp.dest(viewsDest));
});

/*********** Watch files ***********/
gulp.task('watch', function () {
	gulp.watch('views/**/*.pug', ['pug']);
	gulp.watch('assets/sass/**/*.sass', ['sass']);
	gulp.watch('assets/js/*.js', ['concat']).on('change', bs.reload);
	gulp.watch('assests/img/**/*.*', ['img']).on('change', bs.reload);
	gulp.watch('dist/*.html').on('change', bs.reload);
});

/*********** Dev Env task ***********/
gulp.task('dev',['pug', 'sass', 'concat']);

/*********** Build task ***********/
gulp.task('build', ['pug', 'sass', 'concat', 'img', 'compress']);

/*********** Default task ***********/
gulp.task('default', ['dev', 'serve', 'watch']);