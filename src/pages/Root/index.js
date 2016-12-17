import React from 'react';
import { PropTypes } from 'react';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import routes from 'routes';


const Root = ({ store, history }) => (
  <Provider store={store} key={Math.random()}>
    <Router history={history} routes={routes} />
  </Provider>
)

Root.propTypes = {
  store: PropTypes.object,
  history: PropTypes.object
};

export default Root;
