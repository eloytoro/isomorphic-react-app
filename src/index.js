import boot from './boot';
import WebFont from 'webfontloader';
import 'styles/index.css';
import 'styles/theme.css';


WebFont.load({
  custom: {
    families: ['BigNoodleTitling']
  }
});

boot();
