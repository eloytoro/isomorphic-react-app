import React from 'react';
import { PropTypes } from 'react';
import { Provider } from 'react-redux';


const Root = ({ store, children }) => (
  <Provider store={store} key={Math.random()}>
    {children}
  </Provider>
)

Root.propTypes = {
  store: PropTypes.object,
  children: PropTypes.node
};

export default Root;
