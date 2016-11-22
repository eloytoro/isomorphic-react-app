require('babel-register');
const shared = require('../webpack/shared');

const env = {
  browser: true,
  hmr: true
};

module.exports = {
  target: 'web',
  devtool: 'source-map',
  module: {
    loaders: shared.getLoaders(env)
  },
  resolve: {
    modulesDirectories: shared.getResolve(env).modules
  },
  postcss: shared.postcss
};
