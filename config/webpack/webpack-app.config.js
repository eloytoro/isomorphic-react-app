import path from 'path';
import webpack from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import AddAssetHtmlPlugin from 'add-asset-html-webpack-plugin';
import ManifestPlugin from 'webpack-manifest-plugin';
import InterpolateHtmlPlugin from 'react-dev-utils/InterpolateHtmlPlugin';
import paths from '../paths';
import {
  condArray,
  publicPath,
  publicUrl,
  getExternals,
  getLoaders,
  getPlugins,
  getEntries,
  getResolve
} from './shared';


// This is the production configuration.
// It compiles slowly and is focused on producing a fast and minimal bundle.
// The development configuration is different and lives in a separate file.
export default (args = {}) => ({
  // Don't attempt to continue if there are any errors.
  bail: true,
  target: args.browser ? 'web' : 'node',
  // We generate sourcemaps in production. This is slow but gives good results.
  // You can exclude the *.map files from the build during deployment.
  devtool: 'source-map',
  // In production, we only want to load the polyfills and the app code.
  entry: [
    ...getEntries(args),
    paths.polyfills,
    // Finally, this is your app's code:
    paths.appIndexJs
    // We include the app code last so that if there is a runtime error during
    // initialization, it doesn't blow up the WebpackDevServer client, and
    // changing JS code would still trigger a refresh.
  ],
  output: {
    // The build folder.
    path: paths.appBuild,
    // Generated JS file names (with nested folders).
    // There will be one main bundle, and one file per asynchronous chunk.
    // We don't currently advertise code splitting but Webpack supports it.
    filename: 'static/js/[name].js',
    chunkFilename: args.minimize
      ? 'static/js/[name].[chunkhash:8].chunk.js'
      : 'static/js/[name].chunk.js',
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
        include: paths.appSrc,
      }
    ]
  },

  plugins: condArray(
    ...getPlugins(args),
    new webpack.DllReferencePlugin({
      context: paths.appSrc,
      manifest: require(path.join(paths.vendorBuild, 'vendor-manifest.json'))
    }),
    // Makes the public URL available as %PUBLIC_URL% in index.html, e.g.:
    // <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico">
    // In production, it will be an empty string unless you specify "homepage"
    // in `package.json`, in which case it will be the pathname of that URL.
    new InterpolateHtmlPlugin({
      PUBLIC_URL: publicUrl
    }),
    // Generates an `index.html` file with the <script> injected.
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      hash: true,
      minify: !args.minimize ? {} : {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }),

    new AddAssetHtmlPlugin({
      filepath: path.join(paths.vendorBuild, 'vendor.bundle.js'),
      outputPath: 'static/js',
      publicPath: '/static/js',
      hash: true,
      includeSourcemap: true
    }),
    // Generate a manifest file which contains a mapping of all asset filenames
    // to their corresponding output file so that tools can pick it up without
    // having to parse `index.html`.
    new ManifestPlugin({
      fileName: 'asset-manifest.json'
    })
  ),
  // Some libraries import Node modules but don't use them in the browser.
  // Tell Webpack to provide empty mocks for them so importing them works.
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  }
});
