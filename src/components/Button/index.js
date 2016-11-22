import React, { PropTypes } from 'react';
import { Layout } from 'components/Layout';
import classnames from 'classnames';
import _ from 'lodash';
import style from './style.css';


class Button extends React.Component {
  state = { disabled: false };

  restore = () => this.setState({ disabled: false });

  lock = () => this.setState({ disabled: true });

  get disabled() {
    return this.state.disabled || this.props.disabled;
  }

  handleClick = (event) => {
    if (this.disabled) return;
    this.lock();
    Promise.resolve(this.props.onClick(event))
      .then(this.restore)
      .catch(this.restore);
  }

  render() {
    const props = _.omit(this.props, 'onClick', 'className', 'disabled');
    return (
      <Layout
        align="center center"
        {...props}
        className={classnames(this.props.className, style.button)}
        onClick={this.handleClick}
        disabled={this.disabled}
      />
    );
  }
}

Button.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string
};

Button.defaultProps = {
  onClick: _.noop
};

export default Button;