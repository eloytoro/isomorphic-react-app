import webpack from 'webpack';
import fs from 'fs';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import nodeExternals from 'webpack-node-externals';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import WebpackMd5HashPlugin from 'webpack-md5-hash';
import CaseSensitivePathsPlugin from 'case-sensitive-paths-webpack-plugin';
import WatchMissingNodeModulesPlugin from 'react-dev-utils/WatchMissingNodeModulesPlugin';
import url from 'url';
import paths from '../paths';
import autoprefixer from 'autoprefixer';
import precss from 'precss';
import findCacheDir from 'find-cache-dir';
import getClientEnvironment from '../env';

// We use PostCSS for autoprefixing only.
const postcss = () => [
  autoprefixer({
    browsers: [
      '>1%',
      'last 4 versions',
      'Firefox ESR',
      'not ie < 9', // React doesn't support IE8 anyway
    ]
  }),
  precss()
];

/**
 * Takes an array of pairs and returns an array depending on the truthy value of
 * each pair
 * ```
 * condArray([
 *   [true, 1],
 *   [false, 2],
 *   [true, [3, 4]]
 * ]);
 * // => [1, 3, 4]
 * ```
 */
export const condArray = (...pairs) => pairs
  .map(pair => {
    if (!Array.isArray(pair)) return pair;
    return pair[0] ? pair[1] : pair[2];
  })
  .reduce((arr, val = []) => arr.concat(val), []);

const ensureSlash = (path, needsSlash) => {
  var hasSlash = path.endsWith('/');
  if (hasSlash && !needsSlash) {
    return path.substr(path, path.length - 1);
  } else if (!hasSlash && needsSlash) {
    return path + '/';
  } else {
    return path;
  }
}

// We use "homepage" field to infer "public path" at which the app is served.
// Webpack needs to know it to put the right <script> hrefs into HTML even in
// single-page apps that may serve index.html for nested URLs like /todos/42.
// We can't use a relative path in HTML because we don't want to load something
// like /todos/42/static/js/bundle.7289d.js. We have to know the root.
export const homepagePath = require(paths.appPackageJson).homepage;
export const homepagePathname = homepagePath ? url.parse(homepagePath).pathname : '/';
// Webpack uses `publicPath` to determine where the app is being served from.
// It requires a trailing slash, or the file assets will get an incorrect path.
export const publicPath = ensureSlash(homepagePathname, true);
// `publicUrl` is just like `publicPath`, but we will provide it to our app
// as %PUBLIC_URL% in `index.html` and `process.env.PUBLIC_URL` in JavaScript.
// Omit trailing slash as %PUBLIC_PATH%/xyz looks better than %PUBLIC_PATH%xyz.
export const publicUrl = ensureSlash(homepagePathname, false);
// Get environment variables to inject into our app.
export const env = getClientEnvironment(publicUrl);

export const getEntries = ({
  hmr
}) => condArray(
  [hmr, [
    // Include an alternative client for WebpackDevServer. A client's job is to
    // connect to WebpackDevServer by a socket and get notified about changes.
    // When you save a file, the client will either apply hot updates (in case
    // of CSS changes), or refresh the page (in case of JS changes). When you
    // make a syntax error, this client will display a syntax error overlay.
    // Note: instead of the default WebpackDevServer client, we use a custom one
    // to bring better experience for Create React App users. You can replace
    // the line below with these two lines if you prefer the stock client:
    // require.resolve('webpack-dev-server/client') + '?/',
    // require.resolve('webpack/hot/dev-server'),
    require.resolve('react-dev-utils/webpackHotDevClient'),
  ]]
);

export const getLoaders = ({
  minimize,
  browser,
  hmr
}) => condArray(
  // Process JS with Babel.
  {
    test: /\.(js|jsx)$/,
    exclude: paths.appNodeModules,
    loader: 'babel'
  },
  // JSON is not enabled by default in Webpack but both Node and Browserify
  // allow it implicitly so we also enable it.
  {
    test: /\.json$/,
    loader: 'json'
  },
  {
    test: /\.html/,
    loader: 'raw'
  },
  // "file" loader makes sure those assets end up in the `build` folder.
  // When you `import` an asset, you get its filename.
  {
    test: /\.(ico|jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)(\?.*)?$/,
    loader: 'file',
    query: {
      name: 'static/media/[name].[hash:8].[ext]'
    }
  },
  // "url" loader works just like "file" loader but it also embeds
  // assets smaller than specified size as data URLs to avoid requests.
  {
    test: /\.(mp4|webm|wav|mp3|m4a|aac|oga)(\?.*)?$/,
    loader: 'url',
    query: {
      limit: 10000,
      name: 'static/media/[name].[hash:8].[ext]'
    }
  },
  // The notation here is somewhat confusing.
  // "postcss" loader applies autoprefixer to our CSS.
  // "css" loader resolves paths in CSS and adds assets as dependencies.
  // "style" loader normally turns CSS into JS modules injecting <style>,
  // but unlike in development configuration, we do something different.
  // `ExtractTextPlugin` first applies the "postcss" and "css" loaders
  // (second argument), then grabs the result CSS and puts it into a
  // separate file in our build process. This way we actually ship
  // a single CSS file in production instead of JS code injecting <style>
  // tags. If you use code splitting, however, any async bundles will still
  // use the "style" loader inside the async code so CSS from them won't be
  // in the main CSS file.
  [minimize, {
    test: /\.css$/,
    // "?-autoprefixer" disables autoprefixer in css-loader itself:
    // https://github.com/webpack/css-loader/issues/281
    // We already have it thanks to postcss. We only pass this flag in
    // production because "css" loader only enables autoprefixer-powered
    // removal of unnecessary prefixes when Uglify plugin is enabled.
    // Webpack 1.x uses Uglify plugin as a signal to minify *all* the assets
    // including CSS. This is confusing and will be removed in Webpack 2:
    // https://github.com/webpack/webpack/issues/283
    loader: ExtractTextPlugin.extract({
      fallbackLoader: 'style',
      loader: 'css?modules&importLoaders=1&-autoprefixer!postcss'
    })
    // Note: this won't work without `new ExtractTextPlugin()` in `plugins`.
  }],
  [!minimize, {
    test: /\.css$/,
    // "postcss" loader applies autoprefixer to our CSS.
    // "css" loader resolves paths in CSS and adds assets as dependencies.
    // "style" loader turns CSS into JS modules that inject <style> tags.
    // In production, we use a plugin to extract that CSS to a file, but
    // in development "style" loader enables hot editing of CSS.
    loader: 'style!css?modules&importLoaders=1&localIdentName=[local]--[hash:base64:6]!postcss'
  }],
);

export const getPlugins = ({
  minimize,
  hmr,
  browser
}) => condArray(
  [minimize, [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true,
      compress: {
        screw_ie8: true, // React doesn't support IE8
        warnings: false
      },
      mangle: {
        screw_ie8: true
      },
      output: {
        comments: false,
        screw_ie8: true
      }
    }),
    // Note: this won't work without ExtractTextPlugin.extract(..) in `loaders`.
    new ExtractTextPlugin({
      filename: 'static/css/[name].css',
      allChunks: true
    }),

    new CopyWebpackPlugin([{
      from: paths.appPublic
    }])
  ]],
  [hmr, new webpack.HotModuleReplacementPlugin()],
  [!minimize, [
    // Watcher doesn't work well if you mistype casing in a path so we use
    // a plugin that prints an error when you attempt to do this.
    // See https://github.com/facebookincubator/create-react-app/issues/240
    new CaseSensitivePathsPlugin(),
    // If you require a missing module and then `npm install` it, you still have
    // to restart the development server for Webpack to discover it. This plugin
    // makes the discovery automatic so you don't have to restart.
    // See https://github.com/facebookincubator/create-react-app/issues/186
    new WatchMissingNodeModulesPlugin(paths.appNodeModules),
  ]],
  // Makes some environment variables available to the JS code, for example:
  // if (process.env.NODE_ENV === 'production') { ... }. See `./env.js`.
  // It is absolutely essential that NODE_ENV was set to production here.
  // Otherwise React will be compiled in the very slow development mode.
  [env, new webpack.DefinePlugin(env)],
  new webpack.LoaderOptionsPlugin({
    options: {
      postcss: postcss
    }
  }),
  new webpack.DefinePlugin({
    __CLIENT__: browser,
    __SERVER__: !browser
  }),
  new WebpackMd5HashPlugin()
);

export const getResolve = () => ({
  modules: [
    paths.appSrc,
    paths.appNodeModules
  ]
});

export const getExternals = ({ browser }) => {
  const testWhitelist = [
    'react/lib/ExecutionEnvironment',
    'react/lib/ReactContext',
    'react/addons'
  ];
  const whitelist = process.env.NODE_ENV === 'test' ? testWhitelist : [];
  if (browser) return whitelist;
  return [nodeExternals({
    whitelist
  })];
};
