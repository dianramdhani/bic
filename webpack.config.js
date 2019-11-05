const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const app = {
    entry: './assets/js/app.js',
    output: {
        path: path.resolve(__dirname, 'assets/dist'),
        filename: 'app.js',
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                loader: 'html-loader'
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jp(e*)g|svg)$/,
                loader: 'url-loader'
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
    ]
};

module.exports = [app];