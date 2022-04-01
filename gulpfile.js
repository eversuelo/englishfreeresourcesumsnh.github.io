const { src, dest, watch, parallel , series } = require('gulp');

// CSS
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');

// Imagenes
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');

// Javascript
const terser = require('gulp-terser-js');

function css(done) {
    src('src/scss/**/*.scss') // Identificar el archivo .SCSS a compilar
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(sass()) // Compilarlo
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/css')) // Almacenarla en el disco duro
    done();
}

function imagenes(done) {
    const opciones = {
        optimizationLevel: 5,
        quality: 30
    }
    src('src/media/**/*.{png,jpg,jpeg}')
        .pipe(cache(imagemin(opciones)))
        .pipe(dest('build/media'))
    done();
}

function videos(done) {
    src('src/media/**/*.{mp4,ogg,webm}')
        .pipe(dest('build/media'))
    done();
}


function versionWebp(done) {
    const opciones = {
        quality: 30
    };
    src('src/media/**/*.{png,jpg,jpeg}')
        .pipe(webp(opciones))
        .pipe(dest('build/media'))
    done();
}

function versionAvif(done) {
    const opciones = {
        quality: 30
    };
    src('src/media/**/*.{png,jpg,jpeg}')
        .pipe(avif(opciones))
        .pipe(dest('build/media'))
    done();
}

function javascript(done) {
    src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/js'));

    done();
}

function dev(done) {
    watch('src/scss/**/*.scss', css);
    watch('src/js/**/*.js', javascript);
    watch('src/media/**/*.{png,jpg,jpeg}', imagenes);
    watch('src/media/**/*.{mp4,ogg,webm}', videos);
    done();
}

exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.dev = dev;
exports.default = series(imagenes, versionWebp, versionAvif, videos, javascript, dev);