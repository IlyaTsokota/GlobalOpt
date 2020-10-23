'use strict';
const gulp = require('gulp'),
	browserSync = require('browser-sync'),
	sass = require('gulp-sass'),
	rename = require("gulp-rename"),
	autoprefixer = require('gulp-autoprefixer'),
	cleanCSS = require('gulp-clean-css'),
	imagemin = require('gulp-imagemin'),
	htmlmin = require('gulp-htmlmin');


gulp.task('server', function () {
	browserSync.init({
		server: {
			baseDir: "dist"
		}
	});

	gulp.watch("src/*.html").on('change', browserSync.reload);
});

gulp.task('styles', () =>
	gulp.src("src/scss/**/*.+(scss|sass)")
	.pipe(sass({
		outputStyle: 'compressed'
	}).on('error', sass.logError))
	.pipe(rename({
		prefix: "",
		suffix: ".min",
	}))
	.pipe(autoprefixer())
	.pipe(cleanCSS({
		compatibility: 'ie8'
	}))
	.pipe(gulp.dest('dist/css'))
	.pipe(browserSync.stream()));

gulp.task('watch', () => {
	gulp.watch("src/scss/**/*.+(scss|sass|css)").on('change', gulp.parallel('styles', browserSync.reload));
	gulp.watch("src/*.html").on('change', gulp.parallel('html'));
	gulp.watch("src/js/*.js").on('change', gulp.parallel('scripts', browserSync.reload));
});

gulp.task('html', () => {
	return gulp.src("src/*.html")
		.pipe(htmlmin({
			collapseWhitespace: true
		}))
		.pipe(gulp.dest('dist/'));
});

gulp.task('scripts', () => {
	return gulp.src("src/js/**/*.js")
		.pipe(gulp.dest('dist/js'));
});

gulp.task('fonts', () => {
	return gulp.src("src/fonts/**/*")
		.pipe(gulp.dest('dist/fonts'));
});

gulp.task('icons', () => {
	return gulp.src("src/icons/**/*")
		.pipe(imagemin())
		.pipe(gulp.dest('dist/icons'));
});

gulp.task('mailer', () => {
	return gulp.src("src/mailer/**/*")
		.pipe(gulp.dest('dist/mailer'));
});

gulp.task('images', () => {
	return gulp.src("src/img/**/*")
		.pipe(imagemin())
		.pipe(gulp.dest('dist/img'));
});

gulp.task('default',
	gulp.parallel('watch', 'server', 'styles', 'scripts', 'fonts', 'icons', 'mailer', 'images', 'html'));