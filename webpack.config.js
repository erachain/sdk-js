var path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: './lib/index.js',
    output: {
        path: path.resolve(__dirname, 'dist/js'),
        filename: 'eracrypto.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },
    plugins: [
        new CopyPlugin([
          { from: 'src/index.html', to: '../index.html' },
        ]),
    ]
}
