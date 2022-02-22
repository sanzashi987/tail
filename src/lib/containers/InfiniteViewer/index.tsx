import React, { Component } from 'react';
import styles from './index.module.scss';

class InfiniteViewer extends Component {
  getScale() {
    return 1;
  }

  render() {
    return <div className={styles['infinite-wrapper']}>{this.props.children}</div>;
  }
}

export default InfiniteViewer;
