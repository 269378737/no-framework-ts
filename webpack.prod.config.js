const merge = require('webpack-merge');
const common = require('./webpack.base.config.js');
// 提取css到单独的css文件
const miniCssExtractPlugin=require('mini-css-extract-plugin');
// 开启Gzip压缩
const CompressWebpackPlugin = require('compression-webpack-plugin');
// 压缩css
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
// 压缩js
const TerserPlugin = require("terser-webpack-plugin");

const webpack = require('webpack');

// 分析打包所用时长
const SpeedMeasurePligun = require('speed-measure-webpack-plugin');

const smp = new SpeedMeasurePligun();

const cdnUrl = 'http://192.168.188.72/cdn/hbidxms';

module.exports = smp.wrap(merge(common, {
    mode: 'production',
    // output: {
        // publicPath: cdnUrl,  // 设置静态文件打包后的CDN地址
    // },

    optimization: {
        splitChunks: {  // 分离js代码
            chunks: 'all'
        },
        runtimeChunk: true,
        minimizer: [
            new TerserPlugin({ 
                cache: true,
                parallel: true,
                sourceMap: true
            })
        ],
    },
    plugins: [
        new webpack.HashedModuleIdsPlugin({
            hashDigest: 'hex'
        }),
        new CompressWebpackPlugin({
            test: /\.(js|css|html|svg)$/
        }),
        new miniCssExtractPlugin({
            filename:'./assets/css/[name].[contenthash].css'   //输出的css文件名，放置在dist/assets/css目录下
        }),
        new OptimizeCSSAssetsPlugin()
    ],
    // externals: {
    //     'jsbarcode': 'JsBarcode',
    //     highcharts: 'Highcharts'
    // },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader:miniCssExtractPlugin.loader
                    },
                    'css-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10 * 1024, // 小于10k的图片转base64
                            name: 'assets/img/[name].[hash:8].[ext]',
                            publicPath: '../../' // cdnUrl
                        }
                    }
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            limit: 10000,
                            name: 'assets/fonts/[name].[hash:8].[ext]',
                            publicPath: '../../' // cdnUrl
                        }
                    }
                ]
            }
        ]
    },
}))