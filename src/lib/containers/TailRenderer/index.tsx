import { Component, createRef } from "react";
import NodeRenderer from "../NodeRenderer";
import EdgeRenderer from "../EdgeRenderer";
import InfiniteViewer from "../InfiniteViewer";
import type { MountedNodes, NodeInternalInfo } from '../../types'

class TailRenderer extends Component {

  mountedNodes: MountedNodes = new Map()
  edgeRendererRef = createRef<EdgeRenderer>()
  nodeRendererRef = createRef<NodeRenderer>()

  getEdgesFromNodeId = (node: string) => {
    return this.edgeRendererRef.current?.nodeToEdge.get(node)
  }

  findUnreachableItems = () => {

  }

  registerNodeEl = (id: string, node: NodeInternalInfo) => {
    this.mountedNodes.set(id, node)
  }

  updateNodeEl = (id: string, node: NodeInternalInfo) => {
    const lastNode = this.mountedNodes.get(id)
    this.mountedNodes.set(id, { ...lastNode, ...node })
  }

  delistNodeEl = (id: string) => {
    this.mountedNodes.delete(id)
  }

  render() {
    return <InfiniteViewer>
      <NodeRenderer ref={this.nodeRendererRef} />
      <EdgeRenderer ref={this.edgeRendererRef} />
    </InfiniteViewer>
  }
}


export default TailRenderer