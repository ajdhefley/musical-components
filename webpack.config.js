const path = require('path');
const dotenv = require('dotenv');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

dotenv.config();

module.exports = {
    devServer: {
        port: 9000
    },
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js',
    },
    resolve: {
        modules: [path.join(__dirname, 'src'), 'node_modules'],
        alias: {
            react: path.join(__dirname, 'node_modules', 'react'),
        },
        extensions: [ '.tsx', '.ts', '.js', 'scss' ]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                loader: 'ts-loader'
            },
            {
                test: /\.scss?$/,
                use: [
                    // Creates `style` nodes from JS strings
                    "style-loader",

                    // Translates CSS into CommonJS
                    "css-loader",

                    // Compiles Sass to CSS
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: process.env.NODE_ENV == 'development'
                        }
                    }
                ]
            }
        ],
    },
    plugins: [
        new HtmlWebPackPlugin({
            template: './public/index.html',
        }),
        new MiniCssExtractPlugin({
            filename: process.env.NODE_ENV == 'development' ? '[name].css' : '[name].[hash].css',
            chunkFilename: process.env.NODE_ENV == 'development' ? '[id].css' : '[id].[hash].css'
        }),
        new webpack.DefinePlugin({
            'process.env': JSON.stringify(process.env)
        })
    ],
    entry: {
        app: './src/index.tsx'
    },
};