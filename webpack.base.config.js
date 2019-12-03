const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const chalk = require('chalk');
const webpack = require('webpack');
module.exports = {
    entry: './src/index.ts',
    output: {
        filename: './assets/js/[name].[contenthash].js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        // new ProgressBarPlugin({
        //     format: '  build [:bar] ' + chalk.green.bold(':percent') + ' (:elapsed seconds)',
        //     clear: false
        // }),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: './src/index.html',
            minify: {
                removeAttributeQuotes: false // 是否移除属性的引号
            }
        })
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.html$/,
                use: [ {
                    loader: 'html-loader',
                    options: {
                        minimize: false
                    }
                }],
            }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
        alias: {
            '@': path.resolve(__dirname, './src/'),
            '@model': path.resolve(__dirname, './src/model/')
        }
    },
    stats: "minimal"
}