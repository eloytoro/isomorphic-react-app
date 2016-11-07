import React, { PropTypes } from 'react';
import style from './style.css';
import Layout from './Layout';

/**
 * Utility for centering Layouts inside other Layouts, has the same parameters
 * as the <Layout> element, but it always fills the parent component.
 * (from http://stackoverflow.com/questions/15381172/css-flexbox-child-height-100)
 */
const Container = ({
  children,
  ...props
}) => (
  <Layout fill className={style.container} nowrap>
    <Layout {...props} fill>
      {children}
    </Layout>
  </Layout>
);

Container.propTypes = {
  children: PropTypes.node
};

export default Container;
