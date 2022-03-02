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
  DeletePayload,
  HandleType,
  EdgeInProgressAtomUpdater,
} from '@types';
import { edgeInProgressAtom } from '@app/atoms/edges';
import { CoordinateCalc } from '@app/components/Dragger';
import { findDeletedItem, getAtom } from './mutation';
import { switchActive } from './activateHandlers';
import {
  createEdgePayload,
  disableEdgeReconnect,
  enableEdgeReconnect,
  hasConnectedEdgeActive,
  createBasicConnect,
  createMoveCallback,
  createEndCallback,
  addReconnectToState,
} from './connectHandlers';
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
      handle: {
        onMouseDown: this.onHandleMouseDown,
        onMouseUp: this.onHandleMouseUp,
      },
      activateItem: this.activateNext,
      getScale: this.getScale,
    };
  }

  /* Activate & Deactivate */
  activateNext = (e: React.MouseEvent, type: SelectedItemType, id: string) => {
    const append = isModifierExact(e) && CtrlOrCmd(e);
    if (!append) this.deactivateLast();
    this.activeItems[id] = { id, type };
    switchActive(this, type, id, true);
  };

  deactivateLast = () => {
    Object.keys(this.activeItems).forEach((key) => {
      const { id, type } = this.activeItems[key];
      switchActive(this, type, id, false);
    });
    this.activeItems = {};
  };

  /* Connect and reconnect */
  onHandleMouseDown: ConnectMethodType = (e, type, nodeId, handleId) => {
    //only edge active will try reconnect
    const { edgeTree, edgeAtoms } = this.edgeRef.current!;
    const possibleEdge = hasConnectedEdgeActive(edgeTree, this.activeItems, nodeId, handleId);
    const { x, y } = this.getHandleXY(type, nodeId, handleId);
    const basicState = createBasicConnect(type, x, y, nodeId, handleId);
    if (possibleEdge !== false) {
      // reconnect
      const { getAtom, Get } = this;
      addReconnectToState(basicState, type, possibleEdge, getAtom, Get);
      this.Set(edgeAtoms[possibleEdge], enableEdgeReconnect);
    }
    this.edgeInProgressUpdater(basicState);
    this.dragger.start(e, {
      x,
      y,
      parent: document.body,
      getScale: this.getScale,
      movecb: createMoveCallback(this.edgeInProgressUpdater, type),
      endcb: createEndCallback(),
    });
  };

  createEnd(type: HandleType, node: string, handle: string) {
    const { to, active, nodeId, handleId, reconnect, prevEdgeId } = this.Get(edgeInProgressAtom)!;
    if (!active || to !== type) return;
    this.props.onEdgeCreate(createEdgePayload(to, node, handle, nodeId, handleId));
  }

  getHandleXY(type: HandleType, nodeId: string, handleId: string) {
    const handles = this.Get(this.getAtom('node', nodeId) as RecoilState<NodeAtom>).handles;
    if (!handles || !handles[type][handleId]) throw console.log('fail to fetch start handle info');
    return handles[type][handleId];
  }

  onHandleMouseUp: ConnectMethodType = (e, type, nodeId, handleId) => {
    this.dragger.reset();
  };

  tryConnect = (x: number, y: number) => {
    const { reconnect, prevEdgeId } = this.Get(edgeInProgressAtom);
    if (reconnect && prevEdgeId) {
      const { target, targetNode } = this.Get(this.getAtom('edge', prevEdgeId)).edge;
      const { x: X, y: Y } = this.Get(this.getAtom('node', targetNode)).handles.target[target];
      const threshold = this.props.dropThreshold;
      if (Math.abs(x - X) < threshold && Math.abs(y - Y) < threshold) {
        this.Set(this.getAtom('edge', prevEdgeId), disableEdgeReconnect);
      } else {
        this.deleteItem([{ type: 'edge', id: prevEdgeId }]);
      }
    }
  };

  render() {
    const { nodes, edges } = this.props;
    return (
      <InfiniteViewer ref={this.viewer}>
        <RecoilRoot>
          <RecoilNexus ref={this.nexus} />
          <InterfaceProvider value={this.contextInterface}>
            <NodeRenderer nodes={nodes} ref={this.nodeRef} mounted={this.nodesReady} />
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

  deleteItem(payload: DeletePayload) {
    const { nodes, edges } = findDeletedItem(this.edgeRef.current!.edgeTree, payload);
    this.props.onDelete(nodes, edges);
  }
  getAtom = <T extends SelectedItemType>(type: T, id: string): PoolType<T> => {
    if (type === 'edge') {
      return getAtom(id, this.edgeRef.current?.edgeAtoms) as PoolType<T>;
    } else {
      return getAtom(id, this.nodeRef.current?.nodeAtoms) as PoolType<T>;
    }
  };
  Set = <T,>(atom: RecoilState<T>, updater: T | ((cur: T) => T)) =>
    this.nexus.current!.setRecoil<T>(atom, updater); // ! shall be ok
  Get = <T,>(atom: RecoilValue<T>) => this.nexus.current!.getRecoil<T>(atom);
  Reset = (atom: RecoilState<any>) => this.nexus.current!.resetRecoil(atom);
  getNodeAtoms = () => this.nodeRef.current?.nodeAtoms ?? {};
  getScale = () => this.viewer.current?.getScale() || 1;
  edgeInProgressUpdater: EdgeInProgressAtomUpdater = (updater) =>
    this.Set(edgeInProgressAtom, updater);
  nodesReady = () => this.setState({ nodesReady: true });
}

export default TailCore;
