// webpack.common.js 新增MP3处理规则
const path = require("path");
const webpack = require("webpack");
const webpackPackageJson = require("./package.json");
const fs = require("fs");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        popup: "./src/popup/index.tsx",
        content: "./src/content/index.ts",
        background: "./src/background/index.ts"
    },
    output: {
        filename: "[name].js",
        path: path.resolve(__dirname, "dist"),
        publicPath: "/" // 新增公共路径配置
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        alias: {
            '@assets': path.resolve(__dirname, 'src/assets') // 添加webpack别名
        }
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: 'public', to: '.' },
                { from: 'manifest.json', to: '.' }
            ]
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
                test: /\.css$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[local]_[hash:base64:5]',
                                exportLocalsConvention: 'camelCase'
                            },
                            importLoaders: 1
                        }
                    }
                ],
                include: /\.module\.css$/
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
                exclude: /\.module\.css$/
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: ['file-loader']
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: ['file-loader']
            },
            {
                test: /\.mp3$/,
                type: 'asset/inline',
                generator: {
                    dataUrl: {
                        encoding: 'base64',
                        mimetype: 'audio/mpeg'
                    }
                }
            }
        ]
    }
};