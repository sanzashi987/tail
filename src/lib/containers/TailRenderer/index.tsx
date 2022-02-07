import { Component, createRef } from "react";
import NodeRenderer from "../NodeRenderer";
import EdgeRenderer from "../EdgeRenderer";
import InfiniteViewer from "../InfiniteViewer";
import type { SelectedItemCollection, NodeInternals, NodeInternalInfo, NodeInternalMutation } from '@types'
import { defaultState, StateProvider, InterfaceProvider, StateValue, InterfaceValue, InterfaceMethodType } from '@app/contexts/instance'

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
      startReconnecting: this.startReconnecting
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

  startConnecting: InterfaceMethodType = (nodeId, handleId) => {

  }

  onConnected: InterfaceMethodType = (nodeId, handleId) => {

  }


  startReconnecting: InterfaceMethodType = (nodeId, handleId) => {

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
        />
      </StateProvider>
    </InfiniteViewer>
  }
}


export default TailRenderer