import React, { Component, PropTypes } from 'react';
import logo from './logo.svg';
import { connect } from 'react-redux';
import * as counterActions from 'actions/counter';
import { Layout } from 'components/Layout';
import style from './style.css';


class App extends Component {
  render() {
    return (
      <Layout fill className={style.container} direction={{ '> small': 'column', 'small': 'row' }}>
        <div className={style.header}>
          <img src={logo} className={style.logo} alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className={style.intro}>
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <p className={style.intro}>
          Count: {this.props.count}
          <button onClick={this.props.add}>{'+'}</button>
          <button onClick={this.props.subtract}>{'-'}</button>
        </p>
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
