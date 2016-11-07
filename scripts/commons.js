import chalk from 'chalk';
import path from 'path';
import stripAnsi from 'strip-ansi';
import paths from '../config/paths';
import filesize from 'filesize';
import fs from 'fs-extra';
import { sync as gzipSize } from 'gzip-size';
import { sync as rimrafSync } from 'rimraf';

// Print out errors
export const printErrors = (summary, errors) => {
  console.log(chalk.red(summary));
  console.log();
  errors.forEach(err => {
    console.log(err.message || err);
    console.log();
  });
}

// Input: /User/dan/app/build/static/js/main.82be8.js
// Output: /static/js/main.js
export const removeFileNameHash = (fileName, output) => {
  return fileName
    .replace(output, '')
    .replace(/\/?(.*)(\.\w+)(\.js|\.css)/, (match, p1, p2, p3) => p1 + p3);
}

// Input: 1024, 2048
// Output: "(+1 KB)"
const getDifferenceLabel = (currentSize, previousSize) => {
  const FIFTY_KILOBYTES = 1024 * 50;
  const difference = currentSize - previousSize;
  const fileSize = !Number.isNaN(difference) ? filesize(difference) : 0;
  if (difference >= FIFTY_KILOBYTES) {
    return chalk.red('+' + fileSize);
  } else if (difference < FIFTY_KILOBYTES && difference > 0) {
    return chalk.yellow('+' + fileSize);
  } else if (difference < 0) {
    return chalk.green(fileSize);
  } else {
    return '';
  }
}

// Print a detailed summary of build files.
export const printFileSizes = (stats, previousSizeMap, output) => {
  const assets = stats.toJson().assets
    .filter(asset => /\.(js|css)$/.test(asset.name))
    .map(asset => {
      const fileContents = fs.readFileSync(output + '/' + asset.name);
      const size = gzipSize(fileContents);
      const previousSize = previousSizeMap[removeFileNameHash(asset.name, output)];
      const difference = getDifferenceLabel(size, previousSize);
      return {
        folder: path.join(output, path.dirname(asset.name)),
        name: path.basename(asset.name),
        size: size,
        sizeLabel: filesize(size) + (difference ? ' (' + difference + ')' : '')
      };
    });
  assets.sort((a, b) => b.size - a.size);
  const longestSizeLabelLength = Math.max.apply(null,
    assets.map(a => stripAnsi(a.sizeLabel).length)
  );
  assets.forEach(asset => {
    let sizeLabel = asset.sizeLabel;
    const sizeLength = stripAnsi(sizeLabel).length;
    if (sizeLength < longestSizeLabelLength) {
      const rightPadding = ' '.repeat(longestSizeLabelLength - sizeLength);
      sizeLabel += rightPadding;
    }
    console.log(
      '  ' + sizeLabel +
      '  ' + chalk.dim(asset.folder + path.sep) + chalk.cyan(asset.name)
    );
  });
}

export const cleanUpApp = () => {
  rimrafSync(paths.appBuild);
};

export const cleanUpVendor = () => {
  rimrafSync(paths.vendorBuild);
};

export const cleanUpServer = () => {
  rimrafSync(paths.serverBuild);
};
