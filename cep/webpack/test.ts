import * as MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { resolve } from 'path';
import * as webpack from 'webpack';
import { merge } from 'webpack-merge';
import { getHandleNodeImportsConfig } from './externals';
import { resolveGlobs } from './util';
import HtmlWebpackPlugin = require('html-webpack-plugin');
import CopyPlugin = require('copy-webpack-plugin');

export function getTestConfig(
    cepProjectRoot: string,
    testFileGlobs: string[],
    options: { filter: string; watch: boolean; outputDir: string }
): webpack.Configuration {
    const testEntryPoint = './test/browser-entry.ts';
    const testFiles = resolveGlobs(testFileGlobs, cepProjectRoot).filter((v) => v.indexOf(options.filter || '') >= 0);

    const entry = [testEntryPoint, ...testFiles];

    console.log(entry);

    let base = merge(
        {
            entry,
            target: 'web',
            mode: 'development',
            watch: !!options.watch,
            watchOptions: {
                ignored: /node_modules/,
            },
            output: {
                filename: '[name].spec.js',
            },
            devtool: 'inline-source-map',
            cache: true,
            resolve: {
                symlinks: false,
                cacheWithContext: false,
                extensions: ['.js', '.json', '.ts', '.tsx'],
            },
            plugins: [
                new MiniCssExtractPlugin({
                    filename: 'styles/[name].css',
                }),
                new HtmlWebpackPlugin({
                    template: 'ejs/mocha.ejs',
                    filename: 'mocha.html',
                    inject: true,
                    chunks: 'all',
                }),
            ],
            optimization: {
                splitChunks: {
                    cacheGroups: {
                        styles: {
                            name: 'styles',
                            test: /\.css$/,
                            chunks: 'all',
                            enforce: true,
                        },
                    },
                },
            },
            module: {
                rules: [
                    {
                        test: /\.(sa|sc|c)ss$/,
                        use: [
                            {
                                loader: MiniCssExtractPlugin.loader,
                            },
                            'css-loader',
                            'sass-loader',
                        ],
                    },
                    {
                        test: /(\.tsx?)$/,
                        exclude: /node_modules/,
                        rules: [
                            {
                                loader: 'ts-loader',
                            },
                        ],
                    },
                ],
            },
        } as webpack.Configuration,
        getHandleNodeImportsConfig()
    );

    if (options.watch) {
        base = merge(base, getTestDevServerConfig(cepProjectRoot, options.outputDir));
    }

    return base;
}

export function getTestDevServerConfig(projectRoot: string, outputDir: string) {
    const contentBase = resolve(projectRoot, outputDir);
    const port = 9000;

    return {
        output: {
            publicPath: `http://localhost:${port}/`,
        },
        devServer: {
            contentBase,
            writeToDisk: true,
            host: 'localhost',
            port,
            hot: true,
            open: true,
            openPage: `http://localhost:${port}/mocha.html`,
            stats: {
                colors: true,
            },
        },
    } as webpack.Configuration;
}
