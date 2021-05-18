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

const globalVarName = 'aex';
const aexFiles = `./!(cep)**/!(exports)*.jsx`;
const aexExports = `./**/exports.jsx`;
const baseLibraryFiles = [aexFiles, aexExports];
const libAeq = `../lib/aequery.jsx`;
const libJson = `../lib/json2.jsx`;
const aexIpc = `./cep/**/*.jsx`;

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

function buildTarget(filename: string, libs?: string[], append?: string[]) {
    const files = libs && libs.length > 0 ? libs.concat(baseLibraryFiles) : baseLibraryFiles;

    let base = gulp
        .src(files, { cwd: paths._build })
        .pipe(concat(filename))
        .pipe(header(`// (c) 2021 KraftyFX <rafikhan@kraftyfx.com>\nvar ${globalVarName}=(function(_export_) {\n`))
        .pipe(footer(`\nreturn _export_;\n})({});`));

    if (append && append.length > 0) {
        base = base.pipe(gulp.src(append, { cwd: paths._build })).pipe(concat(filename));
    }

    return base.pipe(gulp.dest(paths.dist));
}

function buildAexJsx() {
    return buildTarget('aex.jsx', [libAeq]);
}

function buildAexLiteJsx() {
    return buildTarget('aex-lite.jsx');
}

function buildAexCepJsx() {
    return buildTarget('aexcep.jsx', [libAeq, libJson], [aexIpc]);
}

function buildAexCepLiteJsx() {
    return buildTarget('aexcep-lite.jsx', [], [aexIpc]);
}

const buildAllAexTargets = gulp.parallel(buildAexJsx, buildAexLiteJsx, buildAexCepJsx, buildAexCepLiteJsx);

const buildAex = gulp.series(buildAexBaseLibrary, buildAllAexTargets);

function startAex() {
    return gulp.watch([`**/*.tsx`, `**/*.d.ts`], { cwd: paths.src }, buildAex);
}

export const clean = gulp.series(cleanBuild);
export const build = gulp.series(clean, buildAex);
export const start = gulp.series(build, startAex);
