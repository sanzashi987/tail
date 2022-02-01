import React, { Component } from 'react';
import { NodeWrapper } from '../../components/Node';
import type { NodeRendererProps } from '../../types';

class NodeRenderer extends Component<NodeRendererProps> {

  render() {
    const { nodes, nodeClass, ...otherProps } = this.props
    return <div
      className="tail-node-container"
    >
      {nodes.map(node => {
        return <NodeWrapper
          config={node}
          nodeClass={nodeClass}
          {...otherProps}
        />
      })}
    </div>
  }
}

export default NodeRenderer