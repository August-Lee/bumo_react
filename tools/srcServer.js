// This file configures the development web server
// which supports hot reloading and synchronized testing.

// Require Browsersync along with webpack and middleware for it
import browserSync from 'browser-sync';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfigBuilder from '../webpack.config';
import historyApiFallback from 'connect-history-api-fallback';

import proxyMiddleware from 'http-proxy-middleware';
import {serverApi} from '../src/config';


const webpackConfig = webpackConfigBuilder('development');
const bundler = webpack(webpackConfig);

const proxy = proxyMiddleware('/api', {target: serverApi, changeOrigin: true});

// Run Browsersync and use middleware for Hot Module Replacement
browserSync({
  server: {
    baseDir: 'src',

    middleware: [
      proxy,

      webpackDevMiddleware(bundler, {
        // Dev middleware can't access config, so we provide publicPath
        publicPath: webpackConfig.output.publicPath,

        // pretty colored output
        stats: {colors: true},

        // Set to false to display a list of each file that is being bundled.
        noInfo: true

        // for other settings see
        // http://webpack.github.io/docs/webpack-dev-middleware.html
      }),

      // bundler should be the same as above
      webpackHotMiddleware(bundler),

      //allow for the use of a router in the react application
      //so that any url will resolve to index.html
      historyApiFallback()
    ]
  },

  // no need to watch '*.js' here, webpack will take care of it for us,
  // including full page reloads if HMR won't work
  files: [
    'src/*.html'
  ]
});