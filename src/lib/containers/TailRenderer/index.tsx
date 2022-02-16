import { Component, createRef } from "react";
import NodeRenderer from "../NodeRenderer";
import EdgeRenderer from "../EdgeRenderer";
import InfiniteViewer from "../InfiniteViewer";
import type { RecoilNexusInterface, SelectedItem, SelectedItemCollection, InterfaceValue, ConnectMethodType, NodeInternals, NodeInternalInfo, InternalMutation, TailRendererProps, WrapperDraggerInterface } from '@types'
import { StateProvider, InterfaceProvider, StateValue, } from '@app/contexts/instance'
import MarkerDefs from '../MarkerDefs'
import { RecoilRoot } from 'recoil'
import { RecoilNexus } from '@app/utils'


type TailRenderState = {
  connecting: boolean
  selected: SelectedItemCollection
}
class TailRenderer
  extends Component<TailRendererProps, TailRenderState>
  implements InterfaceValue {

  state: TailRenderState = {
    connecting: false,
    selected: {}
  }

  edgeAtoms = {}
  nodeAtoms = {}

  contextState: StateValue = null
  edgeRendererRef = createRef<EdgeRenderer>()
  nodeRendererRef = createRef<NodeRenderer>()
  nexusRef = createRef<RecoilNexusInterface>()

  contextInterface: InterfaceValue
  constructor(props: TailRendererProps) {
    super(props)
    this.contextInterface = {
      startConnecting: this.startConnecting,
      onConnected: this.onConnected,
      startReconnecting: this.startReconnecting,
      // registerNode: this.registerNode,
      // delistNode: this.delistNode,
      activateItem: this.activateItem,
      recoilInterface: this.recoilInterface
    }
  }

  recoilInterface = () => {
    return this.nexusRef.current!
  }

  activateItem = (id: string, item: SelectedItem<'node' | 'edge'>, append?: boolean) => {
    this.setState((prev) => {
      return {
        ...prev,
        selected: {
          ...(!!append ? prev.selected : {}),
          [id]: item
        }
      }
    })
  }

  startConnecting: ConnectMethodType = (nodeId, handleId) => {

  }

  onConnected: ConnectMethodType = (nodeId, handleId) => {

  }


  startReconnecting: ConnectMethodType = (nodeId, handleId) => {

  }

  onDrag() {

  }
  onDragEnd() {

  }
  onDragStart() {

  }


  tryConnect(nodeId: string) {

  }


  render() {
    const { nodes, edges } = this.props
    return <InfiniteViewer>
      <RecoilRoot>
        <RecoilNexus ref={this.nexusRef} />
        <StateProvider value={this.contextState}>
          <InterfaceProvider value={this.contextInterface}>
            <NodeRenderer
              nodes={nodes}
              ref={this.nodeRendererRef} />
            <EdgeRenderer
              edges={edges}
              ref={this.edgeRendererRef}
              connecting={this.state.connecting}
            >
              <MarkerDefs />
            </EdgeRenderer>
          </InterfaceProvider>
        </StateProvider>
      </RecoilRoot>
    </InfiniteViewer>
  }
}


export default TailRenderer