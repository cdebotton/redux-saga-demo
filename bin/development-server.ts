import * as express from 'express';
import * as path from 'path';
import * as webpack from 'webpack';
import * as webpackDevMiddleware from 'webpack-dev-middleware';
import * as webpackHotMiddleware from 'webpack-hot-middleware';

const { PORT } = process.env;

if (!PORT) {
  throw new ReferenceError('process.env.PORT is undefined.');
}

const config: webpack.Configuration = {
  devtool: 'cheap-eval-source-map',
  entry: [
    'react-hot-loader/patch',
    `webpack-hot-middleware/client?path=http://localhost:${PORT}/__webpack_hmr`,
    path.join(__dirname, '..', 'libs', 'client', 'index.tsx'),
  ],
  module: {
    rules: [
      {
        test: /\.tsx?/,
        use: ['react-hot-loader/webpack', 'awesome-typescript-loader'],
      },
    ],
  },
  output: {
    filename: 'bundle.js',
    publicPath: `http://localhost:${PORT}/`,
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
  ],
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },
};

const compiler = webpack(config);
const app = express();

app.use(webpackDevMiddleware(compiler, {
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
  publicPath: config.output.publicPath,
  stats: {
    chunks: false,
    colors: true,
  },
}));

app.use(webpackHotMiddleware(compiler));

app.listen(PORT, () => {
  process.stdout.write(`✅ Listening on port ${PORT}.`);
});
