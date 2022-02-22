import React, { Component } from 'react';
import type { NodeProps } from '@types';
import styles from './BasicNode.module.scss';
import Handle from '../Handle';

class BasicNode extends Component<NodeProps> {
  render() {
    const { id } = this.props.node;
    return (
      <div className={`tail-node__basic ${styles.node}`}>
        <Handle nodeId={id} type="source" handleId="output" />
        <Handle nodeId={id} type="target" handleId="input" />
        {id}
      </div>
    );
  }
}

export default BasicNode;
