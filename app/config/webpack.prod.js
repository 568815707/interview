const merge = require('webpack-merge')
const webpack = require('webpack')
const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const common = require('./webpack.common.js')

const isAnalyzer = process.env.NODE_ENV === 'analyzer'

module.exports = merge(common, {
    mode: 'production',
    plugins: [
      new CleanWebpackPlugin([path.resolve(__dirname, '../dist')], {
        allowExternal: true
      }),
      new webpack.HashedModuleIdsPlugin(),
      // 暴露模块中单值
      // new webpack.ProvidePlugin({
      //   render: ['react-dom', 'render']
      // })

    ].concat(
      isAnalyzer ? new BundleAnalyzerPlugin() : []
    )
})
