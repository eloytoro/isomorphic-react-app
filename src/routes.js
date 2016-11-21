import Root from 'pages/Root';
import loadApp from 'bundle?lazy!pages/App';


export default {
  path: '/',
  component: Root,
  getIndexRoute: (_, callback) => loadApp(
    ({ default: App }) => {
      callback(null, {
        component: App,
      })
    }
  )
};
