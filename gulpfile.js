var gulp = require('gulp');
var $ = require("gulp-load-plugins")({lazy:false});

var AUTOPREFIXER_BROWSERS = [
  'ie >= 9',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

gulp.task('scripts', function(){
    //combine all js files of the app
    gulp.src(['!./app/**/*_test.js','./app/**/*.js'])
        .pipe($.jshint())
        .pipe($.jshint.reporter('default'))
        .pipe($.uglify())
        .pipe($.concat('app.js'))
        .pipe(gulp.dest('./build'));
});

gulp.task('templates',function(){
    //combine all template files of the app into a js file
    gulp.src(['!./app/index.html',
        './app/**/*.html'])
        .pipe($.angularTemplatecache('templates.js',{standalone:true}))
        .pipe($.uglify())
        .pipe(gulp.dest('./build'));
});

gulp.task('css', function(){
    gulp.src('./app/**/*.css')
        .pipe($.concat('app.css'))
        .pipe($.autoprefixer(AUTOPREFIXER_BROWSERS))
        .pipe($.csso())
        .pipe(gulp.dest('./build'));
});

gulp.task('vendorJS', function(){
    //concatenate vendor JS files
    $.bowerFiles()
        .pipe($.filter('**/*.js'))
        .pipe($.uglify())
        .pipe($.concat('lib.js'))
        .pipe(gulp.dest('./build'));
});

gulp.task('vendorCSS', function(){
    //concatenate vendor CSS files
    $.bowerFiles()
        .pipe($.filter('**/*.css'))
        .pipe($.concat('lib.css'))
        .pipe($.csso())
        .pipe(gulp.dest('./build'));
});

gulp.task('assets', function(){
    gulp.src('./app/assets/json/**/*.*')
        .pipe(gulp.dest('./build/assets/json'));
    gulp.src('./app/fonts/**/*.*')
        .pipe(gulp.dest('./build/fonts'));
});

// Optimize Images
gulp.task('images', function () {
    gulp.src('app/assets/img/**/*')
    /*.pipe($.cache($.imagemin({
      progressive: true,
      interlaced: true
    })))*/
    .pipe(gulp.dest('./build/assets/img'));
});

gulp.task('copy-index', function() {
    gulp.src('./app/index.html')
        .pipe($.minifyHtml({ empty:true , quotes:true }))
        .pipe(gulp.dest('./build'));
});

gulp.task('watch',function(){
    gulp.watch([
        'build/**/*.html',        
        'build/**/*.js',
        'build/**/*.css'        
    ], function(event) {
        return gulp.src(event.path)
            .pipe($.connect.reload());
    });
    gulp.watch(['./app/**/*.js','!./app/**/*test.js'],['scripts']);
    gulp.watch(['!./app/index.html','./app/**/*.html'],['templates']);
    gulp.watch('./app/**/*.css',['css']);
    gulp.watch('./app/index.html',['copy-index']);
    gulp.watch(['./app/assets/json/*.*', './app/fonts/*.*'], ['assets']);
    gulp.watch(['./app/assets/img/*.*'], ['images']);
    gulp.watch('gulpfile.js', ['scripts', 'templates', 'css', 'copy-index']);

});

gulp.task('connect', $.connect.server({
    root: ['build'],
    port: 9000,
    livereload: true
}));

gulp.task('default',['connect','scripts','templates','css','copy-index', 'images', 'assets', 'vendorJS','vendorCSS','watch']);