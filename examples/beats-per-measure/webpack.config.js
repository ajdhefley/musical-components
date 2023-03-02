const path = require('path')

module.exports = {
    mode: 'development',
    entry: './src/index.jsx',
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'main.js'
    },
    target: 'web',
    devServer: {
        port: '9500',
        static: ['./public'],
        open: true,
        hot: true,
        liveReload: true
    },
    resolve: {
        extensions: ['.cjs', '.js', '.jsx', '.json'],
        alias: {
            react: path.resolve('node_modules/react')
        }
    },
    module: {
        rules: [
            {
                test: /\.(jsx)$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            }
        ]
    }
}
