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
  EdgeAtom,
  NodeAtom,
  DeletePayload,
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
  addReconnectToState,
  addHandleNode,
} from './connectHandlers';
import NodeRenderer from '../NodeRenderer';
import EdgeRenderer from '../EdgeRenderer';
import InfiniteViewer from '../InfiniteViewer';
import MarkerDefs from '../MarkerDefs';
import '@app/styles/index.scss';

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
  activateNext = (e: React.MouseEvent, type: SelectedItemType, id: string, selected: boolean) => {
    const hold = isModifierExact(e) && CtrlOrCmd(e);
    if (!hold && selected) return;
    if (!hold) {
      this.deactivateLast();
    }
    selected ? delete this.activeItems[id] : (this.activeItems[id] = { id, type });
    switchActive(this, type, id, !selected);
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
    const {
      handles: {
        [type]: {
          [handleId]: { x, y },
        },
      },
      node: { left, top },
    } = this.getAtomState<NodeAtom>('node', nodeId);
    const [absX, absY] = [x + left, y + top];
    let basicState = createBasicConnect(type, absX, absY, nodeId, handleId);
    if (possibleEdge !== false) {
      // reconnect
      basicState = addReconnectToState(basicState, type, possibleEdge, this.getAtomState);
      this.Set(edgeAtoms[possibleEdge], enableEdgeReconnect);
    }
    this.edgeInProgressUpdater(basicState);
    this.dragger.start(e, {
      x: absX,
      y: absY,
      parent: document.body,
      getScale: this.getScale,
      movecb: createMoveCallback(this.edgeInProgressUpdater, type),
      endcb: this.tryConnect,
    });
  };

  onHandleMouseUp: ConnectMethodType = (e, type, nodeId, handleId) => {
    e.stopPropagation();
    const {
      active,
      reconnect,
      prevEdgeId,
      to,
      nodeId: storedNode,
      handleId: storedHandle,
    } = this.Get(edgeInProgressAtom);
    if (to === type && active) {
      const newPayload = createEdgePayload(to, nodeId, handleId, storedNode, storedHandle);
      if (reconnect && prevEdgeId) {
        const toNode = addHandleNode[type];
        const { [type]: prevHandleId, [toNode]: prevNodeId } = this.getAtomState<EdgeAtom>(
          'edge',
          prevEdgeId,
        ).edge;
        if (prevHandleId !== handleId || prevNodeId !== nodeId) {
          this.props.onEdgeUpdate(prevEdgeId, newPayload);
          this.setAtomState('edge', prevEdgeId, disableEdgeReconnect);
        }
      } else {
        this.props.onEdgeCreate(newPayload);
      }
    }
    this.connectReset();
  };

  tryConnect = (x: number, y: number) => {
    const { reconnect, prevEdgeId, to: type } = this.Get(edgeInProgressAtom);
    if (reconnect && prevEdgeId) {
      const { getAtomState: GET, setAtomState: SET } = this;
      const typeNode = addHandleNode[type];
      const {
        edge: { [typeNode]: originNode, [type]: originHandle },
      } = GET<EdgeAtom>('edge', prevEdgeId);
      const { x: X, y: Y } = GET<NodeAtom>('node', originNode).handles[type][originHandle];
      const threshold = this.props.dropThreshold;
      if (Math.abs(x - X) < threshold && Math.abs(y - Y) < threshold) {
        SET<EdgeAtom>('edge', prevEdgeId, disableEdgeReconnect);
      } else {
        this.deleteItem([{ type: 'edge', id: prevEdgeId }]);
      }
    }
    this.Reset(edgeInProgressAtom);
  };

  connectReset = () => {
    this.dragger.reset();
    this.Reset(edgeInProgressAtom);
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
  getAtom = <T extends EdgeAtom | NodeAtom>(type: SelectedItemType, id: string) => {
    const pool =
      type === 'edge' ? this.edgeRef.current!.edgeAtoms : this.nodeRef.current!.nodeAtoms;
    return getAtom(id, pool as unknown as IObject<RecoilState<T>>);
  };
  getAtomState = <T,>(type: SelectedItemType, id: string) =>
    this.Get(this.getAtom(type, id) as unknown as RecoilState<T>);
  setAtomState = <T,>(type: SelectedItemType, id: string, updater: T | ((cur: T) => T)) =>
    this.Set(this.getAtom(type, id) as unknown as RecoilState<T>, updater);
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
