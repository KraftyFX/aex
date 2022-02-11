import * as del from 'del';
import * as gulp from 'gulp';
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
    const config = getTestConfig(__dirname, testSuite, {
        watch: false,
        filter: argv.filter as string,
        outputDir,
        deployDir: paths.user_ae_extension_root,
    });
    return gulp.src(`${paths.tests}`, { read: false }).pipe(webpackStream(config)).pipe(gulp.dest(outputDir));
}

function startTestServer() {
    const config = getTestConfig(__dirname, testSuite, {
        watch: true,
        filter: argv.filter as string,
        outputDir,
        deployDir: paths.user_ae_extension_root,
    });
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

function deployTestAEPs() {
    return gulp.src(`${paths.tests}/assets/*.aep`).pipe(gulp.dest(`${paths._build}/panel/assets`));
}

function deployJsx() {
    return gulp.src([`${paths.estk}/dist/aexcep-lite.jsx`, `${paths.estk}/lib/**`]).pipe(gulp.dest(`${paths._build}/panel`));
}

const buildJsx = gulp.series(yarnBuildJsx, deployJsx);

function deployToAe() {
    return gulp.src([`${paths._build}/panel/**`], { dot: true }).pipe(gulp.dest(paths.user_ae_extension_root));
}

function watchAndDeployArtifacts() {
    gulp.watch(`${paths._build}/panel/**`, deployToAe);
    gulp.watch(`${paths.harness}/**`, buildTestPanel);
    gulp.watch(`${paths.estk}/dist/**`, deployJsx);
    gulp.watch(`${paths.tests}/assets/**`, deployTestAEPs);
}

export const clean = gulp.series(cleanCep, cleanJsx);
export const build = gulp.series(clean, buildTestPanel, buildJsx, buildTestServer, deployTestAEPs, deployToAe);
export const start = gulp.series(build, gulp.parallel(startJsx, startTestServer, watchAndDeployArtifacts));
