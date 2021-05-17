import * as del from 'del';
import * as gulp from 'gulp';
import * as ts from 'gulp-typescript';

export const paths = {
    src: './aex',
    lib: './lib',
    dist: './dist',
};

function cleanBuild() {
    return del([`${paths.dist}/*`], {
        force: true,
        dot: true,
    });
}

function buildAll() {
    const tsProject = ts.createProject(`${paths.src}/tsconfig.json`);

    return gulp
        .src([`**/*.tsx`, `**/*.d.ts`], { cwd: `${__dirname}/${paths.src}` })
        .pipe(tsProject())
        .pipe(gulp.dest(paths.dist));
}

export const clean = gulp.series(cleanBuild);
export const build = gulp.series(cleanBuild, buildAll);
