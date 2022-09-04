import * as del from 'del';
import * as gulp from 'gulp';
import * as concat from 'gulp-concat';
import * as ts from 'gulp-typescript';
const header = require(`gulp-header`);
const footer = require(`gulp-footer`);

const paths = {
    src: './src',
    lib: './lib',
    _build: './_build',
    dist: './dist',
};

function cleanBuild() {
    return del([`${paths._build}/*`, `${paths.dist}/*`], {
        force: true,
        dot: true,
    });
}

function buildAexBaseLibrary() {
    const tsProject = ts.createProject(`${paths.src}/tsconfig.json`);

    return gulp
        .src([`**/*.tsx`, `**/*.d.ts`], { cwd: paths.src })
        .pipe(tsProject())
        .pipe(gulp.dest(`${paths._build}`));
}

function buildAexJsx() {
    const globalVarName = 'aex';
    const filename = `${globalVarName}.jsx`;
    const aexFiles = `./**/!(exports|ipc)*.jsx`;
    const aexExports = `./**/exports.jsx`;
    const baseLibraryFiles = [aexFiles, aexExports];
    const aexIpc = `./cep/*.jsx`;

    return gulp
        .src(baseLibraryFiles, { cwd: paths._build })
        .pipe(concat(filename))
        .pipe(header(`// (c) 2021 KraftyFX <rafikhan@kraftyfx.com>\nvar ${globalVarName}=(function(_export_) {\n`))
        .pipe(footer(`\nreturn _export_;\n})({});`))
        .pipe(gulp.src([aexIpc], { cwd: paths._build }))
        .pipe(concat(filename))
        .pipe(gulp.dest(paths.dist));
}

const buildAex = gulp.series(buildAexBaseLibrary, buildAexJsx);

function startAex() {
    return gulp.watch([`**/*.tsx`, `**/*.d.ts`], { cwd: paths.src }, buildAex);
}

export const clean = gulp.series(cleanBuild);
export const build = gulp.series(clean, buildAex);
export const start = gulp.series(build, startAex);
