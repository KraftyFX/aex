import * as del from 'del';
import * as gulp from 'gulp';
import * as concat from 'gulp-concat';
import * as ts from 'gulp-typescript';
const header = require(`gulp-header`);
const footer = require(`gulp-footer`);

export const paths = {
    src: './aex',
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

function buildAexBase() {
    const tsProject = ts.createProject(`${paths.src}/tsconfig.json`);

    return gulp
        .src([`**/*.tsx`, `**/*.d.ts`], { cwd: paths.src })
        .pipe(tsProject())
        .pipe(gulp.dest(`${paths._build}/jsx`));
}

function getBuildTargetTask(variant: 'estk' | 'estk-lite' | 'cep' | 'cep-lite') {
    return function buildTarget() {
        let files: string[];
        let targetName: string;

        const aexFiles = `jsx/**/!(exports|ipc)*.jsx`;
        const aexExports = `jsx/**/exports.jsx`;
        const aexIpc = `jsx/**/ipc.jsx`;
        const libAeq = `../lib/aequery.jsx`;
        const libJson = `../lib/json2.jsx`;

        switch (variant) {
            case 'estk':
                targetName = 'aex.jsx';
                files = [libAeq, aexFiles, aexExports];
                break;
            case 'estk-lite':
                targetName = 'aex-lite.jsx';
                files = [aexFiles, aexExports];
                break;
            case 'cep':
                targetName = 'aexcep.jsx';
                files = [libAeq, libJson, aexFiles, aexExports];
                break;
            case 'cep-lite':
                targetName = 'aexcep-lite.jsx';
                files = [aexFiles, aexExports];
                break;
        }

        return gulp
            .src(files, { cwd: paths._build })
            .pipe(concat(targetName))
            .pipe(header('var aex=(function(_export_) {\n'))
            .pipe(footer(`\nreturn _export_;\n})({});`))
            .pipe(gulp.src([aexIpc], { cwd: paths._build }))
            .pipe(concat(targetName))
            .pipe(gulp.dest(paths.dist));
    };
}

const buildAexTargets = gulp.parallel(
    getBuildTargetTask('estk'),
    getBuildTargetTask('estk-lite'),
    getBuildTargetTask('cep'),
    getBuildTargetTask('cep-lite')
);

const buildAex = gulp.series(buildAexBase, buildAexTargets);

function startAex() {
    return gulp.watch([`**/*.tsx`, `**/*.d.ts`], { cwd: paths.src }, buildAex);
}

export const clean = gulp.series(cleanBuild);
export const build = gulp.series(clean, buildAex);
export const start = gulp.series(build, startAex);
