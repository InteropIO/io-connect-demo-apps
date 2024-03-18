const path = require('path')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const packageJson = require('./package.json')
const outputDir = path.resolve(__dirname, 'dist')

module.exports = {
    entry: './src/index.ts',
    devtool: 'source-map',
    target: 'web',
    node: false,
    output: {
        path: outputDir,
        filename: `data-service-${packageJson.version}.js`,
        library: 'MockDataGenerator',
        libraryTarget: 'umd',
        libraryExport: 'default',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.json'],
    },
    module: {
        rules: [
            { test: /\.(ts|js)x?$/, loader: 'babel-loader', exclude: /node_modules/ },
        ],
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: 'index.html',
            inject: 'head'
        }),
    ],
}