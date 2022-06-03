import React, { Component, ComponentType } from 'react';
import type { NodeProps } from '@lib/types';
import styles from './BasicNode.module.scss';
import Handle from '../Handle';

const sourceId = 'foldedSource';
const targetId = 'foldedTarget';

class BasicFoldedNode extends Component<NodeProps> {
  render() {
    const {
      node: { id },
    } = this.props;
    return (
      <div className={`tail-node__folded ${styles.node}`}>
        <Handle nodeId={id} type="source" handleId={sourceId} />
        <Handle nodeId={id} type="target" handleId={targetId} />
      </div>
    );
  }
}

export default BasicFoldedNode;
