var webpack = require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    cache: true,
    entry: {
        main:'js/typing.js'
    },
    resolve: {
        modulesDirectories: ["node_modules","src"],
        extensions: ["", ".js"]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        //new webpack.optimize.OccurenceOrderPlugin(true),
        //new webpack.optimize.DedupePlugin(),
        //new webpack.optimize.UglifyJsPlugin({output:{comments: false}}),
        new HtmlWebpackPlugin({template:'src/index.html'})
    ],
    externals:{
    },
    output: {
        path: __dirname,
        filename: "./build/js/[name].bundle.js"
    },
    devServer: {
        contentBase: 'build',
        port: 8080
    },
    module: {
        loaders:[
            {test: /\.js$/, loader: "babel-loader"},
            {test: /\.css$/, loader: "style-loader!css-loader"},
            {test: /\.html$/, loader: "file?name=build/[name].[ext]"},
            {test: /\.(svg|png|jpeg)?$/, loader:"file?name=build/img/[name].[ext]" }
        ]
    }
};
