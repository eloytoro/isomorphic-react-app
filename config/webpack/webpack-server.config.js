import paths from '../paths';
import {
  publicPath,
  getExternals,
  getLoaders,
  getPlugins,
  getResolve
} from './shared';


// This is the production configuration.
// It compiles slowly and is focused on producing a fast and minimal bundle.
// The development configuration is different and lives in a separate file.
export default (args = {}) => ({
  // Don't attempt to continue if there are any errors.
  bail: true,
  target: 'node',
  // We generate sourcemaps in production. This is slow but gives good results.
  // You can exclude the *.map files from the build during deployment.
  devtool: 'source-map',
  // In production, we only want to load the polyfills and the app code.
  entry: [paths.server],
  output: {
    libraryTarget: 'commonjs2',
    path: paths.serverBuild,
    filename: 'index.js',
    publicPath: publicPath
  },
  resolve: getResolve(args),
  plugins: getPlugins(args),
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
  externals: getExternals(args)
});
