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
import { edgeInProgressAtom } from '@app/atoms/edges';
import { getAtom, immutableSelectedHandles, activateHandle, deactivateHandle } from './mutation';
import NodeRenderer from '../NodeRenderer';
import EdgeRenderer from '../EdgeRenderer';
import InfiniteViewer from '../InfiniteViewer';
import MarkerDefs from '../MarkerDefs';

class TailRenderer extends Component<TailRendererProps> {
  activeItems: SelectedItemCollection = {};

  edgeRef = createRef<EdgeRenderer>();
  nodeRef = createRef<NodeRenderer>();
  nexus = createRef<RecoilNexusInterface>();

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
    const atom = this.setSelectedAtom(type, id, true);
    if (type === 'edge') {
      const {
        edge: { sourceNode, target, targetNode, source },
      } = this.recoilGet(atom as RecoilState<EdgeAtom>)!;
      this.setSelectedHandle(sourceNode, source, activateHandle);
      this.setSelectedHandle(targetNode, target, activateHandle);
    }
  }

  deactivateLast() {
    Object.keys(this.activeItems).forEach((key) => {
      const { id, type } = this.activeItems[key];
      this.deactivateAtom(type, id);
    });
    this.activeItems = {};
  }

  deactivateAtom(type: SelectedItemType, id: string) {
    const atom = this.setSelectedAtom(type, id, false);
    if (type === 'edge') {
      const {
        edge: { sourceNode, target, targetNode, source },
      } = this.recoilGet(atom as RecoilState<EdgeAtom>)!;
      this.setSelectedHandle(sourceNode, source, deactivateHandle);
      this.setSelectedHandle(targetNode, target, deactivateHandle);
    }
  }

  setSelectedHandle(
    nodeId: string,
    handleId: string,
    cb: (next: NodeAtom, handleId: string) => void,
  ) {
    const atom = getAtom(nodeId, this.nodeRef.current?.nodeAtoms);
    this.reocoilSet(atom as RecoilState<NodeAtom>, (prev) => {
      const next = immutableSelectedHandles(prev);
      cb(next, handleId);
      return next;
    });
  }

  setSelectedAtom(type: SelectedItemType, id: string, bol: boolean) {
    const atom = this.getAtom(type, id);
    this.reocoilSet(atom, (prev) => {
      const next = { ...prev };
      next.selected = bol;
      return next;
    });
    return atom;
  }

  getAtom(type: SelectedItemType, id: string) {
    const atomPool =
      type === 'edge' ? this.edgeRef.current?.edgeAtoms : this.nodeRef.current?.nodeAtoms;
    return getAtom(id, atomPool);
  }

  reocoilSet<T>(atom: RecoilState<T>, updater: (cur: T) => T) {
    return this.nexus.current?.set<T>(atom, updater);
  }

  recoilGet<T>(atom: RecoilValue<T>) {
    return this.nexus.current?.get<T>(atom);
  }

  startConnecting: ConnectMethodType = (nodeId, handleId) => {};

  onConnected: ConnectMethodType = (nodeId, handleId) => {
    const { active, sourceNode, source } = this.recoilGet(edgeInProgressAtom)!;
    if (active) {
    }

    this.nexus.current?.reset(edgeInProgressAtom);
  };

  startReconnecting: ConnectMethodType = (nodeId, handleId) => {};

  getNodeAtoms = () => {
    return this.nodeRef.current?.nodeAtoms ?? {};
  };

  tryConnect(nodeId: string) {}

  render() {
    const { nodes, edges } = this.props;
    return (
      <InfiniteViewer>
        <RecoilRoot>
          <RecoilNexus ref={this.nexus} />
          <InterfaceProvider value={this.contextInterface}>
            <NodeRenderer nodes={nodes} ref={this.nodeRef} />
            <EdgeRenderer edges={edges} ref={this.edgeRef} getNodeAtoms={this.getNodeAtoms}>
              <MarkerDefs />
            </EdgeRenderer>
          </InterfaceProvider>
        </RecoilRoot>
      </InfiniteViewer>
    );
  }
}

export default TailRenderer;
