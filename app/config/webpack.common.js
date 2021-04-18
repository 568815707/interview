const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const antdExtractCss = require('mini-css-extract-plugin')
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const isdev = process.env.NODE_ENV === 'development'
// console.log(process.env.NODE_ENV)

module.exports = {
    watchOptions: {
      // 不监听的文件夹
      ignored: /node_modules/
    },
    entry: {
      // 入口文件的路径取对于根目录
      app: './src/main.js'
    },
    output:{
      filename: '[name].[hash].js',
      publicPath: '/',
      path: path.resolve(__dirname, '../dist')
    },
    module:{
        rules:[
            {
                test: /\.js$/,
                include: [
                  path.resolve(__dirname, '../src/')
                ],
                use: ['babel-loader']
            },
            {
                test: /\.css$/,
                include: [
                  path.resolve(__dirname, '../node_modules/antd')
                ],
                use: [isdev ? 'style-loader' : antdExtractCss.loader, 'css-loader']
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                include: [
                  path.resolve(__dirname, '../src/')
                ],
                use: ['file-loader']
            }
        ]
    },
    resolve: {
      alias: {
        components : path.resolve(__dirname, '../src/components/'),
        constants: path.resolve(__dirname, '../src/constants/'),
        containers: path.resolve(__dirname, '../src/containers/'),
        utils: path.resolve(__dirname, '../src/utils/'),
        styled: path.resolve(__dirname, '../src/components/styled/')
      }
    },
    // externals : {
    //   React: 'react',
    //   ReactDOM: 'react-dom'
    // },
    optimization: { // 优化配置
      runtimeChunk: {
        name: 'manifest'
      },
      splitChunks: {
          chunks: 'initial',
          cacheGroups: {
            vendor: {
              test: /node_modules\//,
              name: 'vendor',
            },
            commons: {
                test: /components\//,
                name: 'commons',
            }
          }
      },
      minimizer: [ //压缩
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: isdev ? true : false
        })
      ].concat(
        isdev ? [] : [
          new OptimizeCSSAssetsPlugin({}) // 压缩antd-css
        ]
      )
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './index.html',
        inject: true
      })
    ].concat(
      isdev ? [] : [
        new antdExtractCss({ // 提取antd-css
          filename: "[name].css",
        })
      ]
    )
}
