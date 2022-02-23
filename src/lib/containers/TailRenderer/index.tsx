import React, { Component, createRef } from 'react';
import { InterfaceProvider } from '@app/contexts/instance';
import { RecoilRoot, RecoilState, RecoilValue } from 'recoil';
import { CtrlOrCmd, isModifierExact, RecoilNexus } from '@app/utils';
import type {
  SelectedItemCollection,
  InterfaceValue,
  ConnectMethodType,
  TailCoreProps,
  SelectedItemType,
  RecoilNexusInterface,
  NodeAtom,
  PoolType,
} from '@types';
import { edgeInProgressAtom } from '@app/atoms/edges';
import { CoordinateCalc } from '@app/components/Dragger';
import { getAtom, activateEgdeInProgress, switchActive } from './mutation';
import NodeRenderer from '../NodeRenderer';
import EdgeRenderer from '../EdgeRenderer';
import InfiniteViewer from '../InfiniteViewer';
import MarkerDefs from '../MarkerDefs';

class TailCore extends Component<TailCoreProps> {
  activeItems: SelectedItemCollection = {};

  viewer = createRef<InfiniteViewer>();
  edgeRef = createRef<EdgeRenderer>();
  nodeRef = createRef<NodeRenderer>();
  nexus = createRef<RecoilNexusInterface>();
  dragger = new CoordinateCalc();

  state = { nodesReady: false };

  contextInterface: InterfaceValue;
  constructor(props: TailCoreProps) {
    super(props);
    const { onEdgeClick, onDragEnd, onDragStart, onDrag, onNodeClick } = props;
    this.contextInterface = {
      edge: { onEdgeClick },
      node: { onDrag, onDragStart, onDragEnd, onNodeClick },
      startConnecting: this.startConnecting,
      onConnected: this.onConnected,
      startReconnecting: this.startReconnecting,
      activateItem: this.activateNext,
      getScale: this.getScale,
    };
  }

  activateNext = (e: React.MouseEvent, type: SelectedItemType, id: string) => {
    const append = isModifierExact(e) && CtrlOrCmd(e);
    if (!append) this.deactivateLast();
    this.activeItems[id] = { id, type };
    switchActive(this, type, id, true);
  };

  deactivateLast() {
    Object.keys(this.activeItems).forEach((key) => {
      const { id, type } = this.activeItems[key];
      switchActive(this, type, id, false);
    });
    this.activeItems = {};
  }

  getAtom<T extends SelectedItemType>(type: T, id: string): PoolType<T> {
    if (type === 'edge') {
      return getAtom(id, this.edgeRef.current?.edgeAtoms) as PoolType<T>;
    } else {
      return getAtom(id, this.nodeRef.current?.nodeAtoms) as PoolType<T>;
    }
  }
  Set<T>(atom: RecoilState<T>, updater: T | ((cur: T) => T)) {
    return this.nexus.current?.setRecoil<T>(atom, updater);
  }
  Get<T>(atom: RecoilValue<T>) {
    return this.nexus.current?.getRecoil<T>(atom);
  }
  Reset(atom: RecoilState<any>) {
    return this.nexus.current?.resetRecoil(atom);
  }

  startConnecting = (e: React.MouseEvent, nodeId: string, handleId: string) => {
    const handles = this.Get(this.getAtom('node', nodeId) as RecoilState<NodeAtom>)?.handles;
    if (!handles || !handles.source[handleId]) {
      throw new Error('fail to fetch start handle info');
    }
    const { x, y } = handles.source[handleId];
    this.Set(edgeInProgressAtom, activateEgdeInProgress(x, y, nodeId, handleId));
    document.addEventListener('mousemove', this.onConnecting);
    document.addEventListener('mouseup', this.tryConnect);
  };

  onConnecting = (e: MouseEvent) => {
    return;
  };

  tryConnect = (e: MouseEvent) => {};

  resetConnect = () => {
    this.Reset(edgeInProgressAtom);
    document.removeEventListener('mousemove', this.onConnecting);
    document.removeEventListener('mouseup', this.tryConnect);
  };

  onConnected: ConnectMethodType = (e, nodeId, handleId) => {
    e.stopPropagation();
    const { active, sourceNode, source } = this.Get(edgeInProgressAtom)!;
    if (active) {
      this.props.onEdgeCreate({
        source,
        sourceNode,
        target: handleId,
        targetNode: nodeId,
      });
    }
    this.resetConnect();
  };

  startReconnecting: ConnectMethodType = (e, nodeId, handleId) => {
    return;
  };

  getNodeAtoms = () => {
    return this.nodeRef.current?.nodeAtoms ?? {};
  };

  getScale = () => {
    return this.viewer.current?.getScale() || 1;
  };

  stopConnect(nodeId: string) {
    return;
  }

  render() {
    const { nodes, edges } = this.props;
    return (
      <InfiniteViewer ref={this.viewer}>
        <RecoilRoot>
          <RecoilNexus ref={this.nexus} />
          <InterfaceProvider value={this.contextInterface}>
            <NodeRenderer
              nodes={nodes}
              ref={this.nodeRef}
              mounted={() => this.setState({ nodesReady: true })}
            />
            {this.state.nodesReady && (
              <EdgeRenderer edges={edges} ref={this.edgeRef} getNodeAtoms={this.getNodeAtoms}>
                <MarkerDefs />
              </EdgeRenderer>
            )}
          </InterfaceProvider>
        </RecoilRoot>
      </InfiniteViewer>
    );
  }
}

export default TailCore;
