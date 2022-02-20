import React, { Component, createRef } from 'react';
import { InterfaceProvider } from '@app/contexts/instance';
import { RecoilRoot, RecoilState, RecoilValue } from 'recoil';
import { CtrlOrCmd, isModifierExact, RecoilNexus } from '@app/utils';
import type {
  SelectedItemCollection,
  InterfaceValue,
  ConnectMethodType,
  TailRendererProps,
  SelectedItemType,
  RecoilNexusInterface,
  EdgeAtom,
  NodeAtom,
} from '@types';
import NodeRenderer from '../NodeRenderer';
import EdgeRenderer from '../EdgeRenderer';
import InfiniteViewer from '../InfiniteViewer';
import MarkerDefs from '../MarkerDefs';
import { getAtom } from './mutation';

class TailRenderer extends Component<TailRendererProps> {
  activeItems: SelectedItemCollection = {};

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

  activateItem = (e: React.MouseEvent, type: SelectedItemType, id: string) => {
    const append = isModifierExact(e) && CtrlOrCmd(e);
    if (!append) this.deactivateLast();
    this.activateNext(type, id);
  };

  activateNext(type: SelectedItemType, id: string) {
    this.activeItems[id] = { id, type };
    if (type === 'edge') {
      this.activateEdgeAtom(id);
    } else if (type === 'node') {
      this.activateNodeAtom(id);
    }
  }

  activateEdgeAtom(id: string) {
    const atom = getAtom(id, this.nodeRendererRef.current?.nodeAtoms);
  }

  activateNodeAtom(id: string) {
    const atom = getAtom(id, this.edgeRendererRef.current?.edgeAtoms);
  }

  deactivateLast() {
    Object.keys(this.activeItems).forEach((key) => {
      const { id, type } = this.activeItems[key];
      // this.deactivateAtom(id, type);
    });
    this.activeItems = {};
  }

  deactivateAtom(id: string, type: SelectedItemType) {
    const atomPool =
      type === 'edge'
        ? this.edgeRendererRef.current?.edgeAtoms
        : this.nodeRendererRef.current?.nodeAtoms;
    const atom = getAtom(id, atomPool);
    this.reocoilSet<NodeAtom | EdgeAtom>(atom, (prev) => {
      const next = { ...prev };
      next.selected = false;
      return next;
    });
  }

  deactivateHandle(nodeId: string, handleId: string) {
    const atom = getAtom(nodeId, this.nodeRendererRef.current?.nodeAtoms);
    this.reocoilSet(atom as RecoilState<NodeAtom>, (prev) => {
      const next = { ...prev };
      next.selectedHandles = { ...next.selectedHandles };
      delete next.selectedHandles[handleId];
      return next;
    });
  }

  reocoilSet<T>(atom: RecoilState<T>, updater: (cur: T) => T) {
    return this.recoilInterface.current?.set<T>(atom, updater);
  }

  recoilGet<T>(atom: RecoilValue<T>) {
    return this.recoilInterface.current?.get<T>(atom);
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
          <InterfaceProvider value={this.contextInterface}>
            <NodeRenderer nodes={nodes} ref={this.nodeRendererRef} />
            <EdgeRenderer edges={edges} ref={this.edgeRendererRef} getNodeAtoms={this.getNodeAtoms}>
              <MarkerDefs />
            </EdgeRenderer>
          </InterfaceProvider>
        </RecoilRoot>
      </InfiniteViewer>
    );
  }
}

export default TailRenderer;
