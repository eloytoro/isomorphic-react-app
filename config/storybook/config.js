import 'babel-polyfill';
import { configure } from '@kadira/storybook';
import 'styles/index.css';
import 'styles/theme.css';


function loadStories() {
  const req = require.context('../../stories', true, /\.js$/);
  req.keys().forEach(x => req(x));
}

configure(loadStories, module);
