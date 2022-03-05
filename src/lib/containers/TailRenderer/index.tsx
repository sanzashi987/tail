import React, { Component, createRef } from 'react';
import { InterfaceProvider } from '@app/contexts/instance';
import { RecoilState, RecoilValue } from 'recoil';
import { CtrlOrCmd, isModifierExact } from '@app/utils';
import type {
  Node,
  SelectedItemCollection,
  InterfaceValue,
  ConnectMethodType,
  TailCoreProps,
  SelectedItemType,
  EdgeAtom,
  NodeAtom,
  DeletePayload,
  EdgeInProgressAtomUpdater,
  MouseEventCollection,
  DraggerData,
  StoreRootInterface,
} from '@types';
import { edgeInProgressAtom } from '@app/atoms/edges';
import { CoordinateCalc } from '@app/components/Dragger';
import { createNodeDeltaMove, findDeletedItem, getAtom } from './mutation';
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
  validateExistEdge,
} from './connectHandlers';
import NodeRenderer from '../NodeRenderer';
import EdgeRenderer from '../EdgeRenderer';
import InfiniteViewer from '../InfiniteViewer';
import MarkerDefs from '../MarkerDefs';
import '@app/styles/index.scss';
import { StoreContext } from '@app/contexts/store';

const emptyActives = { node: {}, edge: {} };

class TailCore extends Component<TailCoreProps> {
  activeItems: SelectedItemCollection = emptyActives;
  viewer = createRef<InfiniteViewer>();
  edgeRef = createRef<EdgeRenderer>();
  nodeRef = createRef<NodeRenderer>();
  dragger = new CoordinateCalc();
  state = { nodesReady: false };
  contextInterface: InterfaceValue;

  static contextType = StoreContext;
  context!: StoreRootInterface;
  constructor(props: TailCoreProps) {
    super(props);
    const { onEdgeClick, onDragStart, onNodeClick } = props;
    this.contextInterface = {
      edge: { onEdgeClick },
      node: {
        onDrag: this.batchNodeDrag,
        onDragEnd: this.batchNodeDragEnd,
        onNodeClick,
        onDragStart,
      },
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
    switchActive(this, type, id, !selected, this.activeItems[type]);
  };

  deactivateLast = () => {
    this.batchDeactivate('node');
    this.batchDeactivate('edge');
  };

  batchDeactivate(type: SelectedItemType) {
    const pool = this.activeItems[type];
    Object.keys(pool).forEach((key) => {
      switchActive(this, 'node', key, false, pool);
    });
  }

  /* Connect and reconnect */
  onHandleMouseDown: ConnectMethodType = (e, type, nodeId, handleId) => {
    //only edge active will try reconnect
    let newType = type;
    const { edgeTree, edgeAtoms } = this.edgeRef.current!;
    const possibleEdge = hasConnectedEdgeActive(
      edgeTree,
      this.activeItems['edge'],
      nodeId,
      handleId,
    );
    const {
      handles: {
        [newType]: {
          [handleId]: { x, y },
        },
      },
      node: { left, top },
    } = this.getAtomState<NodeAtom>('node', nodeId);
    const [absX, absY] = [x + left, y + top];
    let basicState = createBasicConnect(newType, absX, absY, nodeId, handleId);
    if (possibleEdge !== false) {
      // reconnect
      [newType, basicState] = addReconnectToState(
        basicState,
        newType,
        possibleEdge,
        this.getAtomState,
      );
      this.context.set(edgeAtoms[possibleEdge], enableEdgeReconnect);
    }
    this.edgeInProgressUpdater(basicState);
    this.dragger.start(e, {
      x: absX,
      y: absY,
      parent: document.body,
      getScale: this.getScale,
      movecb: createMoveCallback(this.edgeInProgressUpdater, newType),
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
    } = this.context.get(edgeInProgressAtom);
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
      } else if (!validateExistEdge(newPayload, this.edgeRef.current!.edgeTree)) {
        this.props.onEdgeCreate(newPayload);
      }
    }
    this.connectReset();
  };

  tryConnect = (x: number, y: number) => {
    const { reconnect, prevEdgeId, to: type } = this.context.get(edgeInProgressAtom);
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
        switchActive(this, 'edge', prevEdgeId, false, this.activeItems['edge']);
      }
    }
    this.context.reset(edgeInProgressAtom);
  };

  connectReset = () => {
    this.dragger.reset();
    this.context.reset(edgeInProgressAtom);
  };

  batchNodeDrag = (e: MouseEventCollection, n: Node, d: DraggerData) => {
    if (!this.props.quickNodeUpdate) {
      this.batchEmitUpdate(e, n, d);
    } else {
      const updater = createNodeDeltaMove(d.deltaX, d.deltaY);
      Object.keys(this.activeItems.node).forEach((e: string) => {
        this.setAtomState('node', e, updater);
      });
    }
    this.props.onDrag?.(e, n, d);
  };

  batchNodeDragEnd = (e: MouseEventCollection, n: Node, d: DraggerData) => {
    this.batchEmitUpdate(e, n, d);
    this.props.onDragEnd?.(e, n, d);
  };

  batchEmitUpdate = (e: MouseEventCollection, n: Node, d: DraggerData) => {
    const updater = createNodeDeltaMove(d.deltaX, d.deltaY);
    const updatePayload: Node[] = [];
    Object.keys(this.activeItems.node).forEach((e: string) => {
      updatePayload.push(updater(this.getAtomState<NodeAtom>('node', e)).node);
    });
    this.props.onNodeUpdate(updatePayload);
  };

  render() {
    const { nodes, edges, nodeTemplates } = this.props;
    return (
      <InfiniteViewer ref={this.viewer}>
        <InterfaceProvider value={this.contextInterface}>
          <NodeRenderer
            templates={nodeTemplates}
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
    return getAtom(id, (pool as unknown) as IObject<RecoilState<T>>);
  };
  getAtomState = <T,>(type: SelectedItemType, id: string) =>
    this.context.get((this.getAtom(type, id) as unknown) as RecoilState<T>);
  setAtomState = <T,>(type: SelectedItemType, id: string, updater: T | ((cur: T) => T)) =>
    this.context.set((this.getAtom(type, id) as unknown) as RecoilState<T>, updater);
  getNodeAtoms = () => this.nodeRef.current?.nodeAtoms ?? {};
  getScale = () => this.viewer.current?.getScale() || 1;
  edgeInProgressUpdater: EdgeInProgressAtomUpdater = (updater) =>
    this.context.set(edgeInProgressAtom, updater);
}

export default TailCore;
