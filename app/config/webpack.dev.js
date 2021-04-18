const webpack = require('webpack')
const merge = require('webpack-merge')
const path = require('path')
const common = require('./webpack.common.js')

module.exports = merge(common, {
    mode: 'development', //development
    devtool: 'cheap-module-eval-source-map',
    output:{
      pathinfo: false
    },
    devServer: {
        contentBase: path.resolve(__dirname, '../dist'),
        compress: true,
        historyApiFallback: true,
        overlay:true,
        hot:true,
        port:3333,
        proxy: {
          '/view': {
            target: 'http://localhost:9000',
            changeOrigin:true
          }
        }
    },
    plugins:[
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NamedModulesPlugin()
    ]
})
