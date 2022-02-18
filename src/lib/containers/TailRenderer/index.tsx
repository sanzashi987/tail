import React, { Component, createRef } from 'react';
import { StateProvider, InterfaceProvider, StateValue } from '@app/contexts/instance';
import { RecoilRoot } from 'recoil';
import { CtrlOrCmd, isModifierExact } from '@app/utils';
import type {
  RecoilNexusInterface,
  SelectedItemCollection,
  InterfaceValue,
  ConnectMethodType,
  NodeInternals,
  NodeInternalInfo,
  InternalMutation,
  TailRendererProps,
  WrapperDraggerInterface,
  SelectedItemType,
  SelectedItemPayload,
} from '@types';
import NodeRenderer from '../NodeRenderer';
import EdgeRenderer from '../EdgeRenderer';
import InfiniteViewer from '../InfiniteViewer';
import MarkerDefs from '../MarkerDefs';

type TailRenderState = {
  connecting: boolean;
  selected: SelectedItemCollection;
};
class TailRenderer extends Component<TailRendererProps, TailRenderState> implements InterfaceValue {
  state: TailRenderState = {
    connecting: false,
    selected: {},
  };

  activeHandles = {};

  contextState: StateValue = null;
  edgeRendererRef = createRef<EdgeRenderer>();
  nodeRendererRef = createRef<NodeRenderer>();

  contextInterface: InterfaceValue;
  constructor(props: TailRendererProps) {
    super(props);
    this.contextInterface = {
      startConnecting: this.startConnecting,
      onConnected: this.onConnected,
      startReconnecting: this.startReconnecting,
      // registerNode: this.registerNode,
      // delistNode: this.delistNode,
      activateItem: this.activateItem,
    };
  }

  activateItem = (e: React.MouseEvent, type: SelectedItemType, item: SelectedItemPayload) => {
    const append = isModifierExact(e) && CtrlOrCmd(e);
    this.setState((prev) => {
      return {
        ...prev,
        selected: {
          ...(append ? prev.selected : {}),
          [item.id]: {
            value: item,
            type,
          },
        },
      };
    });
  };

  startConnecting: ConnectMethodType = (nodeId, handleId) => {};

  onConnected: ConnectMethodType = (nodeId, handleId) => {};

  startReconnecting: ConnectMethodType = (nodeId, handleId) => {};

  getNodeAtoms = () => {
    return this.nodeRendererRef.current?.nodeAtoms ?? {};
  };

  onDrag() {}
  onDragEnd() {}
  onDragStart() {}

  tryConnect(nodeId: string) {}

  render() {
    const { nodes, edges } = this.props;
    return (
      <InfiniteViewer>
        <RecoilRoot>
          <StateProvider value={this.contextState}>
            <InterfaceProvider value={this.contextInterface}>
              <NodeRenderer nodes={nodes} ref={this.nodeRendererRef} />
              <EdgeRenderer
                edges={edges}
                ref={this.edgeRendererRef}
                connecting={this.state.connecting}
                getNodeAtoms={this.getNodeAtoms}
              >
                <MarkerDefs />
              </EdgeRenderer>
            </InterfaceProvider>
          </StateProvider>
        </RecoilRoot>
      </InfiniteViewer>
    );
  }
}

export default TailRenderer;
