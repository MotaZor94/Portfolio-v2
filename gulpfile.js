// load modules
const gulp = require('gulp');
const del = require('del');
const livereload = require('gulp-livereload');
const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const sourcemaps = require('gulp-sourcemaps');
const fs   = require('fs');
const notify = require('gulp-notify');
 
// creates default src folder structure
function createSrcStructure(done) {
    const folders = [
        'dist',
        'src',
        'src/assets',
        'src/assets/fonts',
        'src/assets/img',
        'src/scss',
    ];
    const files = [
        'src/assets/index.html',
    ];
 
    folders.forEach(dir => {
        if(!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
            console.log('folder created:', dir);    
        }   
    });
 
    files.forEach(file => {
        if(!fs.existsSync(file)) {
            fs.writeFileSync(file, '');
            console.log('file created:', file);    
        }   
    });
 
    return done();
}
 
// delete all the assets in dist
function assetsClean(done) {
    return del(
        ['dist/**/*', '!dist/**/*.css', '!dist/**/*.html'], 
        { force: true }
    );
}
 
// Copy all assets from src/assets into dist
function assetsPublish(done) {
    return gulp.src('src/assets/**/*')
      .pipe(gulp.dest('dist'));
}
 
// publish HTML files
function htmlPublish(done) {
    return gulp.src('src/assets/**/*.html')
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(gulp.dest('dist'))
      .pipe(livereload());
}
 
// compile SCSS files
function scssCompile(done) {
    return gulp.src('src/scss/**/*.scss')
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', function(err) {
          notify.onError({
              title: 'SCSS Compile',
              message: 'Error',
              sound: 'Beep'
          })(err);
          return done();
      }))
      .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
      }))
    //   .pipe(csso())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('dist/css'))
      .pipe(notify({
        title: 'SCSS Compile',
        message: 'Done'
      }))
      .pipe(livereload());
}
 
// watch files
function watchFiles(done) {
    gulp.watch("src/assets/**/*.html", htmlPublish);
    gulp.watch("src/scss/**/*.scss", scssCompile);
}
 
// start livereload
function livereloadStart(done) {
    livereload.listen();
}
 
// export tasks
exports.structure = createSrcStructure;
exports.publish = gulp.series(assetsClean, assetsPublish);
exports.watch = gulp.parallel(livereloadStart, watchFiles);
