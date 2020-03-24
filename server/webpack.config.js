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
        test: /.(png|jpg|ico|ttf|svg)(\?[a-z0-9=.]+)?$/,
        use: [
          { loader: 'file-loader', }
        ]
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
    publicPath: path.resolve(__dirname, 'public')
  },
  externals: [nodeExternals()],
  optimization: {
    nodeEnv: false // process.env.NODE_ENV를 문자열로 치환하는 기능을 비활성화
  }
};
