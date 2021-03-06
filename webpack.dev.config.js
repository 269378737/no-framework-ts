const merge = require('webpack-merge');
const common = require('./webpack.base.config.js');
const webpack = require('webpack');
// 打包可视化分析
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const model = require('./data/mock-data').model;
const personData = require('./data/mock-data').personData;
const patientBaseInfo = require('./data/mock-data').patientBaseInfo;
module.exports = merge(common, {
    mode: 'development',
    output: {
        filename: '[name].[hash].js',
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    plugins: [
        // new BundleAnalyzerPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery" ,
            jsencrypt: 'jsencrypt'
        }),
        // 注入全局变量
        new webpack.DefinePlugin({
            "model": JSON.stringify(model),
            "patientBaseInfo": JSON.stringify(patientBaseInfo),
            "personData": JSON.stringify(personData)
        })
    ],
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'                   
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader'
                    }
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    {
                        loader: 'file-loader',
                    }
                ]
            },
        ]
    },
    devServer: {
        contentBase: './dist',
        hot: true,
        overlay: true, // 编译出现错误时，将错误直接显示在页面上
    },
    devtool: 'inline-source-map'
})