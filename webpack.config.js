/*** webpack.config.js ***/
const path = require('path');
// const webpack = require('webpack');

module.exports = {
    entry: path.join(__dirname, "src/index.js"),
    output: {
        path: path.join(__dirname, "/build"),
        libraryTarget: 'commonjs2',
        filename: "index.js"
    },
    // plugins: [
    //     webpack.optimize.ModuleConcatenationPlugin()
    // ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                // use: {
                //     loader: "babel-loader",
                //     options: {
                //         presets: ['env']
                //     }
                // },
            }
        ]
    },
    resolve: {
        extensions: [".js"]
    },
    devServer: {
        port: 3001
    }
};