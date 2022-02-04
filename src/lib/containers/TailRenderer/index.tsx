import { Component, createRef } from "react";
import NodeRenderer from "../NodeRenderer";
import EdgeRenderer from "../EdgeRenderer";
import InfiniteViewer from "../InfiniteViewer";
import type { SelectedItemCollection, MountedNodes, NodeInternalInfo } from '@types'
import { defaultState, StateProvider, InterfaceProvider, ConnectingStateValue, InterfaceValue, InterfaceMethodType } from '../../contexts/Connecting'

type TailRenderState = {
  connecting: boolean
  selected: SelectedItemCollection
}
class TailRenderer extends Component<never, TailRenderState> implements InterfaceValue {

  state: TailRenderState = {
    connecting: false,
    selected: {}
  }

  connectingPayload: ConnectingStateValue = defaultState
  mountedNodes: MountedNodes = new Map()
  edgeRendererRef = createRef<EdgeRenderer>()
  nodeRendererRef = createRef<NodeRenderer>()

  connectingInterface: InterfaceValue
  constructor(props: never) {
    super(props)
    this.connectingInterface = {
      startConnecting: this.startConnecting,
      onConnected: this.onConnected,
      startReconnecting: this.startReconnecting
    }
  }


  getEdgesFromNodeId = (node: string) => {
    return this.edgeRendererRef.current?.nodeToEdge.get(node)
  }

  findUnreachableItems = () => {

  }

  registerNode = (id: string, node: NodeInternalInfo) => {
    this.mountedNodes.set(id, node)
  }

  delistNode = (id: string) => {
    this.mountedNodes.delete(id)
  }

  startConnecting: InterfaceMethodType = (nodeId, handleId) => {

  }

  onConnected: InterfaceMethodType = (nodeId, handleId) => {

  }


  startReconnecting: InterfaceMethodType = (nodeId, handleId) => {

  }


  render() {
    return <InfiniteViewer>
      <StateProvider value={this.connectingPayload}>
        <InterfaceProvider value={this.connectingInterface}>
          <NodeRenderer ref={this.nodeRendererRef} />
        </InterfaceProvider>
        <EdgeRenderer
          ref={this.edgeRendererRef}
          connecting={this.state.connecting}
        />
      </StateProvider>
    </InfiniteViewer>
  }
}


export default TailRenderer