const path = require('path');

const CleanWebpackPlugin = require('clean-webpack-plugin');

const WebpackDynamicPublicPath = require('../src');

module.exports = {
    entry: path.resolve(__dirname, 'src'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: 'publicPathPlaceholder'
    },
    module: {
        rules: [
            {
                test: /\.(js)$/,
                include: [
                    path.resolve(__dirname, 'src')
                ],
                exclude: [
                    path.resolve(__dirname, '../node_modules')
                ],
                loader: require.resolve('babel-loader'),
                options: {
                    presets: ['@babel/preset-env'],
                    plugins: ['@babel/plugin-syntax-dynamic-import']
                }
            }
        ]
    },
    resolve: {
        modules: [
            'node_modules',
            path.resolve(__dirname, 'src')
        ],
        extensions: ['.js', '.json', '.jsx', '.css']
    },
    mode: 'development',
    optimization: {
        minimize: false
    },
    devtool: 'cheap-module-source-map',
    context: __dirname,
    target: 'web',
    stats: 'errors-only',
    plugins: [
        new CleanWebpackPlugin('dist'),
        new WebpackDynamicPublicPath({
            externalPublicPath: 'window.externalPublicPath'
        })
    ]
};