const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const browserSync = require('browser-sync').create();
const clean = require('gulp-clean');
const fileInclude = require('gulp-file-include');
const plumber = require('gulp-plumber');
const imagemin = require('gulp-imagemin');
// === Компиляция SCSS ===
function styles() {
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream());
}

// === Перенос HTML ===

function html() {
    return gulp.src(['src/pages/**/*.html'])
        .pipe(plumber({
            errorHandler: function(err) {
                console.error('HTML Error:', err.toString());
                this.emit('end');
            }
        }))
        .pipe(fileInclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
}


// === Перенос JS библиотек ===
function libsJs() {
    return gulp.src([
        'node_modules/aos/dist/aos.js',
        'node_modules/fancybox/dist/js/jquery.fancybox.js'
    ])
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream());
}

// === Очистка `dist` ===
function cleanFiles() {
    return gulp.src('dist/*', {read: false, allowEmpty: true})
        .pipe(clean());
}

// === Перенос CSS библиотек ===
function libsCss() {
    return gulp.src([
        'node_modules/aos/dist/aos.css',
        'node_modules/bootstrap/dist/css/bootstrap.min.css',
        'node_modules/fancybox/dist/css/jquery.fancybox.css',
    ])
        .pipe(gulp.dest('dist/css/libs'))
        .pipe(browserSync.stream());
}

// === Перенос JavaScript файлов ===
function scripts() {
    return gulp.src('src/js/**/*.js')
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream());
}

// === Перенос Изображений ===
function images() {
    return gulp.src('src/img/**/*',{ encoding: false })
        .pipe(plumber({
            errorHandler: (err) => {
                console.error('Error in images task:', err.toString());
                this.emit('end');
            }
        }))
        .pipe(gulp.dest('dist/img'))
        .pipe(browserSync.stream());
}

// === Перенос Шрифтов ===
function fonts() {
    return gulp.src('src/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'))
        .pipe(browserSync.stream());
}


// === Запуск Live-сервера ===
function serve() {
    browserSync.init({
        server: {baseDir: 'dist/'},
        port: 3000,
        notify: false
    });

    gulp.watch('src/scss/**/*.scss', styles);
    gulp.watch('src/js/**/*.js', scripts);
    gulp.watch(['src/pages/**/*.html', 'src/partials/**/*.html'], html);
    gulp.watch('src/img/**/*', images);
    gulp.watch('src/fonts/**/*', fonts);
}

// === Основные задачи ===
gulp.task('build', gulp.series(
    cleanFiles,
    gulp.parallel(styles, scripts, html, images, fonts, libsJs, libsCss)
));
gulp.task('libs', gulp.series(libsJs,libsCss));
gulp.task('default', gulp.series('build', serve));
