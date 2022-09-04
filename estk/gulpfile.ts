import * as del from 'del';
import * as gulp from 'gulp';
import * as concat from 'gulp-concat';
import * as ts from 'gulp-typescript';
const header = require(`gulp-header`);
const footer = require(`gulp-footer`);

const paths = {
    src: './src',
    lib: './lib',
    sample: './sample',
    _build: './_build',
    dist: './dist',
    release: './release',
};

function cleanBuild() {
    return del([`${paths._build}/*`, `${paths.dist}/*`, `${paths.release}/*`], {
        force: true,
        dot: true,
    });
}

function buildAexSourceFiles() {
    const tsProject = ts.createProject(`${paths.src}/tsconfig.json`);

    return gulp
        .src([`**/*.tsx`, `**/*.d.ts`], { cwd: paths.src })
        .pipe(tsProject())
        .pipe(gulp.dest(`${paths._build}`));
}

function assembleAexJsx() {
    const globalVarName = 'aex';
    const filename = `${globalVarName}.jsx`;
    const aexFiles = `./**/!(exports|ipc)*.jsx`;
    const aexExports = `./**/exports.jsx`;
    const baseLibraryFiles = [aexFiles, aexExports];
    const aexIpc = `./cep/*.jsx`;

    return gulp
        .src(baseLibraryFiles, { cwd: paths._build })
        .pipe(concat(filename))
        .pipe(header(`// (c) 2021 KraftyFX <rafikhan@kraftyfx.com>\nvar ${globalVarName}=(function() {\n`))
        .pipe(footer(`\nreturn _export_;\n})({});`))
        .pipe(gulp.src([aexIpc], { cwd: paths._build }))
        .pipe(concat(filename))
        .pipe(gulp.dest(paths.dist));
}

function copyLibs() {
    return gulp.src(`${paths.lib}/*.jsx`, { cwd: '.' }).pipe(gulp.dest(`${paths.release}/libs`));
}

function copyAex() {
    return gulp.src(`${paths.dist}/*.jsx`, { cwd: '.' }).pipe(gulp.dest(paths.release));
}

function copySampleAssets() {
    return gulp.src(`${paths.sample}/*`, { cwd: '.' }).pipe(gulp.dest(paths.release));
}

const buildRelesae = gulp.parallel(copyAex, copyLibs, copySampleAssets);

const buildAex = gulp.series(buildAexSourceFiles, assembleAexJsx);

function startAex() {
    return gulp.watch([`**/*.tsx`, `**/*.d.ts`], { cwd: paths.src }, buildAex);
}

export const clean = gulp.series(cleanBuild);
export const build = gulp.series(clean, buildAex);
export const release = gulp.series(clean, buildAex, buildRelesae);
export const start = gulp.series(build, startAex);
