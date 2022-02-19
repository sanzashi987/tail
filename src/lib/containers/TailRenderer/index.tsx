import React, { Component, createRef } from 'react';
import { StateProvider, InterfaceProvider, StateValue } from '@app/contexts/instance';
import { RecoilRoot } from 'recoil';
import { CtrlOrCmd, isModifierExact, RecoilNexus } from '@app/utils';
import type {
  SelectedItemCollection,
  InterfaceValue,
  ConnectMethodType,
  TailRendererProps,
  SelectedItemType,
  SelectedItemPayload,
  RecoilNexusInterface,
} from '@types';
import NodeRenderer from '../NodeRenderer';
import EdgeRenderer from '../EdgeRenderer';
import InfiniteViewer from '../InfiniteViewer';
import MarkerDefs from '../MarkerDefs';

type TailRenderState = {
  connecting: boolean;
  // selected: SelectedItemCollection;
};
class TailRenderer extends Component<TailRendererProps, TailRenderState> {
  state: TailRenderState = {
    connecting: false,
  };

  activeItems: SelectedItemCollection = {};
  activeHandles = {};

  contextState: StateValue = null;
  edgeRendererRef = createRef<EdgeRenderer>();
  nodeRendererRef = createRef<NodeRenderer>();
  recoilInterface = createRef<RecoilNexusInterface>();

  contextInterface: InterfaceValue;
  constructor(props: TailRendererProps) {
    super(props);
    const { onEdgeClick, onDragEnd, onDragStart, onDrag, onNodeClick } = props;
    this.contextInterface = {
      edge: { onEdgeClick },
      node: { onDrag, onDragStart, onDragEnd, onNodeClick },
      startConnecting: this.startConnecting,
      onConnected: this.onConnected,
      startReconnecting: this.startReconnecting,
      activateItem: this.activateItem,
    };
  }

  activateItem = (e: React.MouseEvent, type: SelectedItemType, item: SelectedItemPayload) => {
    const append = isModifierExact(e) && CtrlOrCmd(e);
    if (!append) this.deactivateLast();
    this.activateAtom(type, item);
  };

  activateAtom(type: SelectedItemType, item: SelectedItemPayload) {
    
  }

  deactivateLast() {
    Object.keys(this.activeItems).forEach((key) => {
      const {
        value: { id },
        type,
      } = this.activeItems[key];
      this.deactivateAtom(id, type);
    });
    this.activeItems = {}
  }

  deactivateNodeAtom(id: string) {
    const atom = this.nodeRendererRef.current?.nodeAtoms[id];
    if (!atom) throw Error('fail to fetch atom pool');
    this.recoilInterface.current?.set(atom, (prev) => {
      const next = { ...prev };
      next.selected = false;
      next.selectedHandles = {};
      return next;
    });
  }

  deactivateEdgeAtom(id: string) {
    const atom = this.edgeRendererRef.current?.edgeAtoms[id];
    if (!atom) throw Error('fail to fetch atom pool');
    this.recoilInterface.current?.set(atom, (prev) => {
      const next = { ...prev };
      next.selected = false;
      return next;
    });
  }

  deactivateAtom(id: string, type: SelectedItemType) {
    if (type === 'edge') {
      this.deactivateEdgeAtom(id);
    } else if (type === 'node') {
      this.deactivateNodeAtom(id);
    }
  }

  startConnecting: ConnectMethodType = (nodeId, handleId) => {};

  onConnected: ConnectMethodType = (nodeId, handleId) => {};

  startReconnecting: ConnectMethodType = (nodeId, handleId) => {};

  getNodeAtoms = () => {
    return this.nodeRendererRef.current?.nodeAtoms ?? {};
  };

  tryConnect(nodeId: string) {}

  render() {
    const { nodes, edges } = this.props;
    return (
      <InfiniteViewer>
        <RecoilRoot>
          <RecoilNexus ref={this.recoilInterface} />
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
