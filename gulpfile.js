var gulp = require('gulp');
var concat = require('gulp-concat');

var configuration = {
    paths: {
        src: {
            html: './src/**/*.html',
            imgs: './src/images/**/*.*',
            css: [
                'node_modules/datatables.net-dt/css/jquery.dataTables.min.css',
                'node_modules/datatables.net-responsive-dt/css/responsive.dataTables.min.css',
                'src/css/styles.css'
            ],
            js: [
                'node_modules/jquery/dist/jquery.min.js',
                'node_modules/flot/dist/es5/jquery.flot.js',
                'node_modules/flot-pie/src/jquery.flot.pie.min.js',
                'node_modules/datatables.net/js/jquery.dataTables.min.js',
                'node_modules/datatables.net-responsive/js/dataTables.responsive.min.js',
                'node_modules/angular/angular.min.js',
                'node_modules/angular-cookies/angular-cookies.min.js',
                'node_modules/angular-route/angular-route.min.js',
                'src/js/main.js',
                'src/js/util.js',
                'src/js/directive.js',
                'src/js/login.js',
                'src/js/header.js',
                'src/js/dashboard.js',
                'src/js/transaction.js'		
            ]
        },
        dist: './build'
    }
};

// Gulp task to copy HTML files to output directory
gulp.task('html', function() {
    return gulp.src(configuration.paths.src.html)
        .pipe(gulp.dest(configuration.paths.dist));
});

gulp.task('copy-imgs', function(){
    return gulp.src(configuration.paths.src.imgs)
        .pipe(gulp.dest(configuration.paths.dist + '/images'));
});

gulp.task('minify-js', function() {
	return gulp.src(configuration.paths.src.js)
    .pipe(concat('app.js'))
    .pipe(gulp.dest(configuration.paths.dist + '/js'));
});

gulp.task('minify-css', function () {
   return gulp.src(configuration.paths.src.css)
       .pipe(concat('style.css'))
       .pipe(gulp.dest(configuration.paths.dist + '/css'))
});

gulp.task('default', gulp.series('html', 'minify-js', 'minify-css', 'copy-imgs', function () {
    gulp.watch(configuration.paths.src.js, gulp.series('minify-js'));
    gulp.watch(configuration.paths.src.imgs, gulp.series('copy-imgs'));
	gulp.watch(configuration.paths.src.html, gulp.series('html'));
    gulp.watch(configuration.paths.src.css, gulp.series('minify-css'));
}));