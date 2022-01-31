import React, { Component, ComponentType, MouseEvent } from 'react';
import type { Node, NodeProps } from '../../types';


type NodeMouseCallback = (e: MouseEvent, n: Node) => void

type NodeRendererProps<Cb = NodeMouseCallback> = {
  nodes: Node[]
  nodeClass?: ComponentType<NodeProps>
  onClick?: Cb
  onMouseEnter?: Cb
  onMouseLeave?: Cb
  onContextMenu?: Cb
  onDragStart?: Cb
  onDragging?: Cb
  onDragEnd?: Cb
}


class NodeRenderer extends Component<NodeRendererProps> {



  render() {
    return <div
      className="tail-node-container"
    >

    </div>
  }
}

export default NodeRenderer