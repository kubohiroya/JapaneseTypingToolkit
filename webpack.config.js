var webpack = require("webpack");
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    cache: true,
    entry: {
        main: 'js/typing.js'
    },
    resolve: {
        modulesDirectories: ["node_modules", "src"],
        extensions: ["", ".js", ".jsx", ".ts", ".tsx"]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        //new webpack.optimize.OccurenceOrderPlugin(true),
        //new webpack.optimize.DedupePlugin(),
        //new webpack.optimize.UglifyJsPlugin({output:{comments: false}}),
        new HtmlWebpackPlugin({template: 'src/index.html'})
    ],
    externals: {},
    output: {
        path: __dirname,
        filename: "./public/js/[name].bundle.js"
    },
    devServer: {
        contentBase: './public',
        headers: {
            "Access-Control-Allow-Origin": "*",// https://ja.wikipedia.org https://labs.goo.ne.jp
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
        },
        port: 8080
    },
    module: {
        loaders: [
            {test: /\.js$/, loader: "babel-loader"},
            {test: /\.tsx?$/, loaders: ["ts"], exclude: /node_modules/},
            {test: /\.css$/, loaders: ["style-loader", "css-loader"]},
            {test: /\.html$/, loader: "file?name=build/[name].[ext]"},
            {test: /\.(svg|png|jpeg)?$/, loader: "file?name=build/img/[name].[ext]"},
            {test: /\.jsx?$/, loaders: ['babel'], exclude: /node_modules/}
        ]
    }
};
