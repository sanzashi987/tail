import React, { Component } from 'react';
import type { NodeProps } from '@app/types';
import styles from './BasicNode.module.scss';
import Handle from '../Handle';

function getClassName(selected: boolean) {
  return `tail-node__basic ${styles.node} ${selected ? 'selected' : ''}`;
}

class BasicNode extends Component<NodeProps> {
  render() {
    const {
      node: { id },
      selected,
    } = this.props;
    return (
      <div className={getClassName(selected)}>
        <Handle nodeId={id} type="source" handleId="output" />
        <Handle nodeId={id} type="target" handleId="input" />
        {id}
      </div>
    );
  }
}

export default BasicNode;
