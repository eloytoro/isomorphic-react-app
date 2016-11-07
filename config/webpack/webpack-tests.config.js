import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import AddAssetHtmlPlugin from 'add-asset-html-webpack-plugin';
import paths from '../paths';
import {
  condArray,
  publicPath,
  getLoaders,
  getExternals,
  getPlugins,
  getResolve
} from './shared';

// This is the production configuration.
// It compiles slowly and is focused on producing a fast and minimal bundle.
// The development configuration is different and lives in a separate file.
export default (args = {}) => ({
  // Don't attempt to continue if there are any errors.
  bail: true,
  target: args.browser ? 'web' : 'node',
  watch: args.watch,
  // We generate sourcemaps in production. This is slow but gives good results.
  // You can exclude the *.map files from the build during deployment.
  devtool: args.browser ? 'eval' : 'source-map',
  // In production, we only want to load the polyfills and the app code.
  entry: {
    tests: condArray(
      paths.polyfills,
      // Finally, this is your app's code:
      [args.browser, paths.testsWeb, paths.testsNode]
      // We include the app code last so that if there is a runtime error during
      // initialization, it doesn't blow up the WebpackDevServer client, and
      // changing JS code would still trigger a refresh.
    )
  },
  output: {
    // The build folder.
    path: paths.testsBuild,
    // Generated JS file names (with nested folders).
    // There will be one main bundle, and one file per asynchronous chunk.
    // We don't currently advertise code splitting but Webpack supports it.
    filename: 'index.js',
    // We inferred the "public path" (such as / or /my-project) from homepage.
    publicPath: publicPath
  },
  resolve: getResolve(args),
  module: {
    loaders: [
      ...getLoaders(args),
      {
        test: /\.(js|jsx)$/,
        loader: 'eslint',
        enforce: 'pre',
        include: paths.tests,
      }
    ]
  },

  plugins: condArray(
    ...getPlugins(args),
    [args.browser, [
      // Generates an `index.html` file with the <script> injected.
      new HtmlWebpackPlugin({
        inject: true,
        template: paths.testsHtml
      }),

      new AddAssetHtmlPlugin({
        filepath: path.join(paths.vendorBuild, 'vendor.bundle.js'),
        hash: true,
        includeSourcemap: true
      })
    ]]
  ),
  externals: getExternals(args)
});
