import path from 'path';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import webpack from 'webpack';
import paths from '../paths';
import { publicUrl, getLoaders, getPlugins } from './shared';


// This is the production configuration.
// It compiles slowly and is focused on producing a fast and minimal bundle.
// The development configuration is different and lives in a separate file.
export default (args = {}) => ({
  // Don't attempt to continue if there are any errors.
  bail: true,
  // We generate sourcemaps in production. This is slow but gives good results.
  // You can exclude the *.map files from the build during deployment.
  devtool: 'source-map',
  // In production, we only want to load the polyfills and the app code.
  entry: {
    vendor: [paths.polyfills, paths.vendorJs]
  },
  output: {
    // The build folder.
    path: paths.vendorBuild,
    publicPath: path.join(publicUrl, `/vendor${process.env.NODE_ENV === 'production' ? '-min' : '-dev'}/`),
    // Generated JS file names (with nested folders).
    // There will be one main bundle, and one file per asynchronous chunk.
    // We don't currently advertise code splitting but Webpack supports it.
    filename: 'vendor.bundle.js',
    chunkFilename: '[name].[chunkhash:6].js',
    library: '[name]_[hash]'
  },
  module: {
    loaders: getLoaders(args)
  },
  plugins: [
    ...getPlugins(args),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
      reportFilename: '../vendor-report.html'
    }),
    new webpack.DllPlugin({
      path: path.join(paths.vendorBuild, '[name]-manifest.json'),
      context: paths.appSrc,
      name: '[name]_[hash]'
    })
  ],
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
});
