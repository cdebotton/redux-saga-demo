import * as path from 'path';
import * as webpack from 'webpack';

export default {
  entry: path.join(__dirname, 'libs', 'client', 'index.tsx'),
  module: {
    rules: [
      {
        test: /\.tsx?/,
        use: 'awesome-typescript-loader',
      },
    ],
  },
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'dist'),
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      comments: false,
      sourceMap: false,
    }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
};
