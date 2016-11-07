import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import { sync as gzipSize } from 'gzip-size';
import webpack from 'webpack';
import createAppConfig from '../config/webpack/webpack-app.config';
import createVendorConfig from '../config/webpack/webpack-vendor.config';
import createServerConfig from '../config/webpack/webpack-server.config';
import paths from '../config/paths';
import checkRequiredFiles from 'react-dev-utils/checkRequiredFiles';
import recursive from 'recursive-readdir';
import packageJson from '../package.json';
import objectHash from 'object-hash';
import {
  removeFileNameHash,
  printErrors,
  printFileSizes,
  cleanUpApp,
  cleanUpServer,
  cleanUpVendor
} from './commons';

// Warn and crash if required files are missing
if (!checkRequiredFiles([paths.appHtml, paths.appIndexJs])) {
  process.exit(1);
}

const isProd = process.env.NODE_ENV === 'production';

export const vendor = (callback) => {
  recursive(paths.vendorBuild, (err, fileNames) => {
    var previousSizeMap = (fileNames || [])
      .filter(fileName => /\.(js|css)$/.test(fileName))
      .reduce((memo, fileName) => {
        var contents = fs.readFileSync(fileName);
        var key = removeFileNameHash(fileName, paths.vendorBuild);
        memo[key] = gzipSize(contents);
        return memo;
      }, {});

    // Remove all content but keep the directory so that
    // if you're in it, you don't end up in Trash
    cleanUpVendor();

    console.log('Creating an optimized vendor build...');
    webpack(createVendorConfig({ minimize: isProd })).run((err, stats) => {
      if (err) {
        printErrors('Failed to compile.', [err]);
        process.exit(1);
      }

      if (stats.compilation.errors.length) {
        printErrors('Failed to compile.', stats.compilation.errors);
        process.exit(1);
      }

      console.log(chalk.green('Compiled successfully.'));
      console.log();

      console.log('File sizes after gzip:');
      console.log();
      printFileSizes(stats, previousSizeMap, paths.vendorBuild);
      console.log();
      callback();
    });
  });
};

export const ensureVendorBuild = async () => {
  try {
    fs.lstatSync(paths.vendorBuild);
    fs.ensureFileSync(paths.lockfile);
    const lock = fs.readFileSync(paths.lockfile, 'utf8');
    const hash = objectHash(packageJson.dependencies);
    if (lock !== hash) {
      fs.writeFileSync(paths.lockfile, hash, 'utf8');
      throw new Error('Deps changed!');
    }
  } catch (err) {
    await new Promise(resolve => vendor(resolve));
  }
};

export const app = async (callback) => {
  await ensureVendorBuild();
  // First, read the current file sizes in build directory.
  // This lets us display how much they changed later.
  recursive(paths.appBuild, (err, fileNames) => {
    var previousSizeMap = (fileNames || [])
      .filter(fileName => /\.(js|css)$/.test(fileName))
      .reduce((memo, fileName) => {
        var contents = fs.readFileSync(fileName);
        var key = removeFileNameHash(fileName);
        memo[key] = gzipSize(contents);
        return memo;
      }, {});

    // Remove all content but keep the directory so that
    // if you're in it, you don't end up in Trash
    cleanUpApp();
    const config = createAppConfig({ minimize: isProd, browser: true });

    // Start the webpack build
    console.log('Creating an optimized production build...');
    webpack(config).run((err, stats) => {
      if (err) {
        printErrors('Failed to compile.', [err]);
        process.exit(1);
      }

      if (stats.compilation.errors.length) {
        printErrors('Failed to compile.', stats.compilation.errors);
        process.exit(1);
      }

      console.log(chalk.green('Compiled successfully.'));
      console.log();

      console.log('File sizes after gzip:');
      console.log();
      printFileSizes(stats, previousSizeMap, paths.appBuild); console.log();

      var openCommand = process.platform === 'win32' ? 'start' : 'open';
      var homepagePath = require(paths.appPackageJson).homepage;
      var publicPath = config.output.publicPath;
      if (homepagePath && homepagePath.indexOf('.github.io/') !== -1) {
        // "homepage": "http://user.github.io/project"
        console.log('The project was built assuming it is hosted at ' + chalk.green(publicPath) + '.');
        console.log('You can control this with the ' + chalk.green('homepage') + ' field in your '  + chalk.cyan('package.json') + '.');
        console.log();
        console.log('The ' + chalk.cyan('build') + ' folder is ready to be deployed.');
        console.log('To publish it at ' + chalk.green(homepagePath) + ', run:');
        console.log();
        console.log('  ' + chalk.cyan('npm') +  ' install --save-dev gh-pages');
        console.log();
        console.log('Add the following script in your ' + chalk.cyan('package.json') + '.');
        console.log();
        console.log('    ' + chalk.dim('// ...'));
        console.log('    ' + chalk.yellow('"scripts"') + ': {');
        console.log('      ' + chalk.dim('// ...'));
        console.log('      ' + chalk.yellow('"deploy"') + ': ' + chalk.yellow('"gh-pages -d build"'));
        console.log('    }');
        console.log();
        console.log('Then run:');
        console.log();
        console.log('  ' + chalk.cyan('npm') +  ' run deploy');
        console.log();
      } else if (publicPath !== '/') {
        // "homepage": "http://mywebsite.com/project"
        console.log('The project was built assuming it is hosted at ' + chalk.green(publicPath) + '.');
        console.log('You can control this with the ' + chalk.green('homepage') + ' field in your '  + chalk.cyan('package.json') + '.');
        console.log();
        console.log('The ' + chalk.cyan('build') + ' folder is ready to be deployed.');
        console.log();
      } else {
        // no homepage or "homepage": "http://mywebsite.com"
        console.log('The project was built assuming it is hosted at the server root.');
        if (homepagePath) {
          // "homepage": "http://mywebsite.com"
          console.log('You can control this with the ' + chalk.green('homepage') + ' field in your '  + chalk.cyan('package.json') + '.');
          console.log();
        } else {
          // no homepage
          console.log('To override this, specify the ' + chalk.green('homepage') + ' in your '  + chalk.cyan('package.json') + '.');
          console.log('For example, add this to build it for GitHub Pages:')
          console.log();
          console.log('  ' + chalk.green('"homepage"') + chalk.cyan(': ') + chalk.green('"http://myname.github.io/myapp"') + chalk.cyan(','));
          console.log();
        }
        console.log('The ' + chalk.cyan('build') + ' folder is ready to be deployed.');
        console.log('You may also serve it locally with a static server:')
        console.log();
        console.log('  ' + chalk.cyan('npm') +  ' install -g pushstate-server');
        console.log('  ' + chalk.cyan('pushstate-server') + ' build');
        console.log('  ' + chalk.cyan(openCommand) + ' http://localhost:9000');
        console.log();
      }
      callback();
    });
  });
}

export const server = async (callback) => {
  await new Promise(resolve => app(resolve));
  // Remove all content but keep the directory so that
  // if you're in it, you don't end up in Trash
  cleanUpServer();
  const config = createServerConfig({ minimize: isProd });

  // Start the webpack build
  console.log('Creating an optimized server build...');
  webpack(config).run((err, stats) => {
    if (err) {
      printErrors('Failed to compile.', [err]);
      process.exit(1);
    }

    if (stats.compilation.errors.length) {
      printErrors('Failed to compile.', stats.compilation.errors);
      process.exit(1);
    }

    console.log(chalk.green('Compiled successfully.'));
    console.log();

    require('../server');
    callback();
  });
}
