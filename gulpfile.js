const gulp = require('gulp');
const del = require('del');
const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
// const csso = require('gulp-csso');
const sourcemaps = require('gulp-sourcemaps');
const fs   = require('fs');
const terser = require('gulp-terser');

// creates default src folder structure
const createSrcStructure = (done) => {
    const folders = [
        'dist',
        'src',
        'src/assets',
        'src/assets/fonts',
        'src/assets/img',
        'src/scss',
        'src/js',
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
const assetsClean = (done) => {
    return del(
        ['dist/**/*', '!dist/**/*.css', '!dist/**/*.html', '!dist/**/*.js'], 
        { force: true }
    );
}
 
// Copy all assets from src/assets into dist
const assetsPublish = (done) => {
    return gulp.src('src/assets/**/*')
      .pipe(gulp.dest('dist'));
}

// publish HTML files
const htmlPublish = (done) => {
    return gulp.src('src/assets/**/*.html')
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(gulp.dest('dist'));
}

// compile SCSS files
const scssCompile = (done) => {
    return gulp.src('src/scss/**/*.scss')
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
      }))
    //   .pipe(csso())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest('dist/css'));
}

// Gulp task to minify JavaScript files
const minifyJs = (done) => {
    return gulp.src('src/js/**/*.js')
      .pipe(terser())
      .pipe(gulp.dest('dist/js'));
}
 
// watch files
const watchFiles = (done) => {
    gulp.watch("src/assets/**/*.html", htmlPublish);
    gulp.watch("src/scss/**/*.scss", scssCompile);
    gulp.watch("src/JS/**/*.js", minifyJs);
}


// export tasks
exports.structure = createSrcStructure;
exports.publish = gulp.series(assetsClean, assetsPublish, scssCompile, minifyJs);
exports.watch = gulp.parallel(watchFiles);