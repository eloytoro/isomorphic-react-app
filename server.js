const { handleRender } = require('./build/server');
const paths = require('./config/paths');
const path = require('path');
const chalk = require('chalk');
const express = require('express');
const openBrowser = require('react-dev-utils/openBrowser');

const app = express();
const port = 3000;
const host = 'localhost';
const protocol = 'http';

app.use('/static', express.static(path.join(paths.appBuild, '/static')));
app.use('/favicon.ico', express.static(path.join(paths.appBuild, '/favicon.ico')));
app.get('*', handleRender);


console.log(chalk.magenta(`Listening on port ${port}`));
openBrowser(protocol + '://' + host + ':' + port + '/');
app.listen(port);
