const nodeExternals = require('webpack-node-externals');
const path = require('path');

module.exports = {
  entry: './bin/www.ts',
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: 'ts-loader',
        options: {
          configFile: 'tsconfig.webpack.json'
        },
        exclude: [
          /node_modules/
        ],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'public/[name].[hash].[ext]',
          }
        },
      }
    ]
  },
  mode: process.env.NODE_ENV ? process.env.NODE_ENV : 'production',
  devtool: 'source-map',
  target: 'node',
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  externals: [nodeExternals()],
  optimization: {
    nodeEnv: false // process.env.NODE_ENV를 문자열로 치환하는 기능을 비활성화
  }
};
