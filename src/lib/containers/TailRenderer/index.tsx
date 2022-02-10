import { Component, createRef } from "react";
import NodeRenderer from "../NodeRenderer";
import EdgeRenderer from "../EdgeRenderer";
import InfiniteViewer from "../InfiniteViewer";
import type { SelectedItemCollection, InterfaceValue, ConnectMethodType, NodeInternals, NodeInternalInfo, NodeInternalMutation } from '@types'
import { defaultState, StateProvider, InterfaceProvider, StateValue, } from '@app/contexts/instance'
import MarkerDefs from '../MarkerDefs'


type TailRenderState = {
  connecting: boolean
  selected: SelectedItemCollection
}
class TailRenderer
  extends Component<never, TailRenderState>
  implements InterfaceValue, NodeInternalMutation {

  state: TailRenderState = {
    connecting: false,
    selected: {}
  }

  contextState: StateValue = defaultState
  nodeInternals: NodeInternals = new Map()
  edgeRendererRef = createRef<EdgeRenderer>()
  nodeRendererRef = createRef<NodeRenderer>()

  contextInterface: InterfaceValue
  constructor(props: never) {
    super(props)
    this.contextInterface = {
      startConnecting: this.startConnecting,
      onConnected: this.onConnected,
      startReconnecting: this.startReconnecting,
      registerNode: this.registerNode,
      delistNode: this.delistNode
    }
  }


  getEdgesFromNodeId = (node: string) => {
    return this.edgeRendererRef.current?.nodeToEdge.get(node)
  }

  findUnreachableItems = () => {

  }

  registerNode = (id: string, node: NodeInternalInfo) => {
    this.nodeInternals.set(id, node)
  }

  delistNode = (id: string) => {
    this.nodeInternals.delete(id)
  }

  startConnecting: ConnectMethodType = (nodeId, handleId) => {

  }

  onConnected: ConnectMethodType = (nodeId, handleId) => {

  }


  startReconnecting: ConnectMethodType = (nodeId, handleId) => {

  }


  render() {
    return <InfiniteViewer>
      <StateProvider value={this.contextState}>
        <InterfaceProvider value={this.contextInterface}>
          <NodeRenderer ref={this.nodeRendererRef} />
        </InterfaceProvider>
        <EdgeRenderer
          ref={this.edgeRendererRef}
          connecting={this.state.connecting}
        >
          <MarkerDefs />
        </EdgeRenderer>
      </StateProvider>
    </InfiniteViewer>
  }
}


export default TailRenderer