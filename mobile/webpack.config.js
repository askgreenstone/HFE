/**
 * webpack 配置文件
 * 配置独立项、入口文件、输出项信息
 */
var path = require('path');
var webpack = require('webpack');
var node_modules_dir = path.join(__dirname, 'node_modules');
var components_dir = path.join(__dirname, 'js/components')+"/";
var css_dir = path.join(__dirname, 'css/');
console.log(__dirname);
//独立项
var deps = [
    'react/dist/react.min.js',
    'jquery/dist/jquery.min.js',
    'underscore/underscore-min.js'
];

//重定向文件
var alias= {

};
var config = {
    devtool: 'inline-source-map',
    entry: [
        'webpack-dev-server/client?http://127.0.0.1:4000',
        'webpack/hot/only-dev-server',
        './js/app.js'
    ],
    output: {
        path: path.join(__dirname, 'public/'),//打包输出路径
        // publicPath: '/public/',//本地测试
        publicPath: './public/',//服务器部署
        filename: 'app.js'
        

    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.ProvidePlugin({
            $: 'jquery'
        })
    ],
    externals: [],//忽略打包文件
    resolve: {
        alias: [],
        extensions:['','.js','.json']//自动补全文件后缀名
    },
    module: {
        noParse : [],
        loaders: [{
            test: /\.jsx?$/,
            loaders: ['react-hot','babel'],
            exclude: /node_modules/
        },{
            test: /\.less$/, 
            loader: 'style-loader!css-loader!less-loader' 
        },{ 
            test: /\.css$/, 
            loader: 'style-loader!css-loader' 
        },{
            test: /\.(jpg|png|svg)$/, 
            loader: 'url?limit=8192'
        }]
    }
}

//加载 alias项
deps.forEach(function (dep) {
    var depPath = path.resolve(node_modules_dir, dep);
    config.module.noParse.push(depPath);
});

//重定向文件赋值
config.resolve.alias = alias;

module.exports = config;