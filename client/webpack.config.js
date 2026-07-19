const path = require('path')
const webpack = require('webpack')

module.exports = {
    context: __dirname,
    entry: './src/index.ts',
    output: {
        path: path.resolve(__dirname, 'public'),
        publicPath: '/public',
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'ts-loader',
                },
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    plugins: [
        // Optional absolute WS URL for standalone hosts (e.g. itch.io).
        // Empty string keeps the default same-origin /ws behavior.
        new webpack.DefinePlugin({
            __WS_URL__: JSON.stringify(process.env.WS_URL || ''),
        }),
    ],
}
