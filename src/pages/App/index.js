import React, { Component, PropTypes } from 'react';
import config from 'app-config';
import logo from 'assets/images/logo.svg';
import { connect } from 'react-redux';
import * as counterActions from 'actions/counter';
import { Layout } from 'components/Layout';
import Button from 'components/Button';
import style from './style.css';


class App extends Component {
  render() {
    return (
      <Layout fill direction="column">
        <Layout className={style.header} align="start center">
          <img src={logo} className={style.logo} alt="logo" />
          <h1>{config.title}</h1>
        </Layout>
        <Layout direction="column" size="auto" align="center center">
          Count: {this.props.count}
          <Layout className={style.intro} align="space-around center">
            <Button onClick={this.props.subtract}>{'-'}</Button>
            <Button onClick={this.props.add}>{'+'}</Button>
          </Layout>
        </Layout>
      </Layout>
    );
  }
}

App.propTypes = {
  count: PropTypes.number.isRequired,
  add: PropTypes.func.isRequired,
  subtract: PropTypes.func.isRequired,
};

export default connect(state => ({ count: state.counter }), counterActions)(App);
