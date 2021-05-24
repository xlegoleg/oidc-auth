/* eslint-disable @typescript-eslint/no-var-requires */
const HtmlWebPackPlugin = require('html-webpack-plugin')
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')
const DefinePlugin = require('webpack/lib/DefinePlugin');
const path = require('path')
const dotenv = require('dotenv');

module.exports = {
  output: {
    publicPath: 'http://localhost:8090/'
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src/'),
      '@utils': path.resolve(__dirname, 'src/utils/'),
      '@services': path.resolve(__dirname, 'src/services')
    }
  },

  devServer: {
    historyApiFallback: true,
    contentBase: path.join(__dirname, 'public'),
    port: 8090,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization'
    },
    proxy: {

    }
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/]
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['css-loader']
      },
      {
        test: /\.(jpg|jpeg|png|woff|woff2|eot|ttf|svg)$/,
        use: [
          {
            loader: 'file-loader'
          }
        ]
      },
      {
        test: /\.s(c|a)ss$/,
        use: [
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: require('sass'),
              sassOptions: {
                indentedSyntax: true // optional
              }
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new ModuleFederationPlugin({
      name: 'auth',
      filename: 'remoteEntry.js',
      exposes: {
        './main': './src/index'
      }
    }),
    new HtmlWebPackPlugin({
      template: './public/index.html'
    }),
    new DefinePlugin({
      'process.env': JSON.stringify(dotenv.config().parsed)
    })
  ]
}
