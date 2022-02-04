import { Component, createRef } from "react";
import NodeRenderer from "../NodeRenderer";
import EdgeRenderer from "../EdgeRenderer";
import InfiniteViewer from "../InfiniteViewer";
import type { SelectedItemCollection, MountedNodes, NodeInternalInfo } from '../../types'
import { defaultState, StateProvider, InterfaceProvider, ConnectingStateValue } from '../../contexts/Connecting'

type TailRenderState = {
  connecting: boolean
  selected: SelectedItemCollection
}
class TailRenderer extends Component<{}, TailRenderState> {

  state: TailRenderState = {
    connecting: false,
    selected: {}
  }
  connectingPayload: ConnectingStateValue = defaultState


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
      <StateProvider value={this.connectingPayload}>
        <InterfaceProvider>
          <NodeRenderer ref={this.nodeRendererRef} />
        </InterfaceProvider>
        <EdgeRenderer ref={this.edgeRendererRef} />
      </StateProvider>
    </InfiniteViewer>
  }
}


export default TailRenderer