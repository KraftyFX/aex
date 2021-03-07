import * as del from 'del';
import * as gulp from 'gulp';
import * as concat from 'gulp-concat';
import * as shell from 'gulp-shell';
import * as webpackStream from 'webpack-stream';
import { argv } from 'yargs';
import { paths } from './webpack/contants';
import { startWebpackDevServer } from './webpack/devserver';
import { getTestConfig } from './webpack/test';

function cleanCep() {
    return del([`${paths._build}/*`, `${paths.user_ae_extension_root}/*`], {
        force: true,
        dot: true,
    });
}

function cleanJsx() {
    return gulp.src(paths.estk, { read: false }).pipe(shell([`yarn clean`], { cwd: paths.estk }));
}

const testSuite = [`${paths.tests}/**/*.spec.ts`];
const outputDir = `${paths._build}/webpack`;

function buildTestServer() {
    const config = getTestConfig(__dirname, testSuite, { watch: false, filter: argv.filter as string, outputDir });
    return gulp.src(`${paths.tests}`, { read: false }).pipe(webpackStream(config)).pipe(gulp.dest(outputDir));
}

function startTestServer() {
    const config = getTestConfig(__dirname, testSuite, { watch: true, filter: argv.filter as string, outputDir });
    return startWebpackDevServer(config);
}

function buildTestPanel() {
    return gulp.src([`${paths.harness}/**`], { dot: true }).pipe(gulp.dest(`${paths._build}/panel`));
}

function startJsx() {
    return gulp.src(paths.estk, { read: false }).pipe(shell([`yarn start`], { cwd: paths.estk }));
}

function yarnBuildJsx() {
    return gulp.src(paths.estk, { read: false }).pipe(shell([`yarn build`], { cwd: paths.estk }));
}

function combineJsxAndDeploy() {
    return gulp
        .src(`${paths.estk}/dist/*.jsx`)
        .pipe(concat('all.jsx'))
        .pipe(gulp.dest(`${paths._build}/panel`));
}

const buildJsx = gulp.series(yarnBuildJsx, combineJsxAndDeploy);

function deployToAe() {
    return gulp.src([`${paths._build}/panel/**`], { dot: true }).pipe(gulp.dest(paths.user_ae_extension_root));
}

function watchAndDeployArtifacts() {
    gulp.watch(`${paths._build}/panel/**`, deployToAe);
    gulp.watch(`${paths.harness}/**`, buildTestPanel);
    gulp.watch(`${paths.estk}/dist/**`, combineJsxAndDeploy);
}

export const clean = gulp.series(cleanCep, cleanJsx);

export const build = gulp.series(clean, buildTestPanel, buildJsx, buildTestServer, deployToAe);
export const start = gulp.series(build, gulp.parallel(startJsx, startTestServer, watchAndDeployArtifacts));
