import React, { Component } from 'react';
import shallowEqual from 'react-redux/lib/utils/shallowEqual';
import provider from './provider';


const connectScreenSize = (mapScreenToProps) => (ComposedComponent) => {
  class ConnectScreenSize extends Component {
    constructor(props) {
      super(props);
      const screenSize = provider.getScreenSize();
      this.screenSizeProps = this.computeScreenSizeProps(screenSize, props);
      this.state = { screenSize };
    }

    componentDidMount() {
      this.unsubscribe = provider.subscribe(this.handleChange);
    }

    componentWillUnmount() {
      if (this.unsubscribe) this.unsubscribe();
    }

    computeScreenSizeProps(screenSize, props) {
      return mapScreenToProps(screenSize, props);
    }

    handleChange = () => {
      const screenSize = provider.getScreenSize();
      const nextScreenSizeProps = this.computeScreenSizeProps(screenSize, this.props);
      if (this.screenSizeProps && shallowEqual(nextScreenSizeProps, this.screenSizeProps))
        return;
      this.screenSizeProps = nextScreenSizeProps;
      this.setState({ screenSize });
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
          {...this.screenSizeProps}
        />
      );
    }
  }

  return ConnectScreenSize;
};

export default connectScreenSize;
