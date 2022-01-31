import React, { Component } from 'react';
import type { NodeWrapperProps } from '../../types';


class NodeWrapper extends Component<NodeWrapperProps> {



  render() {
    const { nodeClass: Node, config } = this.props
    return <div className="tail-node-wrapper">
      <Node config={config} />
    </div>
  }
}



export default NodeWrapper