var path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './lib/index.js',
    output: {
        path: path.resolve(__dirname, 'dist/js'),
        filename: 'erachainapi.js',
        library: 'EraSDK',
        libraryTarget: 'umd',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "babel-loader",
                        options:  {
                            presets: [
                                '@babel/preset-env'
                            ],
                            plugins: [
                                '@babel/plugin-proposal-class-properties'
                            ]
                        }

                    }
                ]
            }
        ]
    },
    plugins: [
        new CopyPlugin([
          { from: 'src/index.html', to: '../index.html' },
          { from: 'src/transaction.html', to: '../transaction.html' },
        ]),
        new webpack.IgnorePlugin(/^\.\/(?!english)/, /bip39\/src\/wordlists$/),
    ]
}
