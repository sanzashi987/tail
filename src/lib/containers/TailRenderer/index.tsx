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
} from '@types';
import { edgeInProgressAtom } from '@app/atoms/edges';
import { CoordinateCalc } from '@app/components/Dragger';
import { getAtom, createEdgeInProgressUpdater } from './mutation';
import { activateEgdeInProgress, switchActive } from './activateHandlers';
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

  deactivateLast = () => {
    Object.keys(this.activeItems).forEach((key) => {
      const { id, type } = this.activeItems[key];
      switchActive(this, type, id, false);
    });
    this.activeItems = {};
  };

  startConnecting = (e: React.MouseEvent, nodeId: string, handleId: string) => {
    this.startConnectingInner(e, nodeId, handleId, false);
  };

  startConnectingInner = (
    e: React.MouseEvent,
    nodeId: string,
    handleId: string,
    reconnect: boolean,
  ) => {
    const handles = this.Get(this.getAtom('node', nodeId) as RecoilState<NodeAtom>).handles;
    if (!handles || !handles.source[handleId]) {
      throw new Error('fail to fetch start handle info');
    }
    const { x, y } = handles.source[handleId];
    this.Set(edgeInProgressAtom, activateEgdeInProgress(x, y, nodeId, handleId, reconnect));
    this.dragger.start(e, x, y, document.body, this.getScale());
    document.addEventListener('mousemove', this.onConnecting);
    document.addEventListener('mouseup', this.tryConnect);
  };

  onConnecting = (e: MouseEvent) => {
    e.stopPropagation();
    const { x, y } = this.dragger.iter(e, document.body, this.getScale());
    this.Set(edgeInProgressAtom, createEdgeInProgressUpdater(x, y));
    return;
  };

  tryConnect = (e: MouseEvent) => {
    e.stopPropagation();
    const { x, y } = this.dragger.end(e, document.body, this.getScale());
    const { reconnect, prevEdgeId } = this.Get(edgeInProgressAtom);
    if (reconnect && prevEdgeId) {
      const { target, targetNode } = this.Get(this.getAtom('edge', prevEdgeId)).edge;
      const { x: X, y: Y } = this.Get(this.getAtom('node', targetNode)).handles.target[target];
      const threshold = this.props.dropThreshold;
      if (Math.abs(x - X) < threshold && Math.abs(y - Y) < threshold) {
        this.Set(this.getAtom('edge', prevEdgeId), (prev) => ({ ...prev, reconnect: false }));
      } else {
        this.deleteItem([{ type: 'edge', id: prevEdgeId }]);
      }
    }
    this.resetConnect();
  };

  deleteItem(payload: DeletePayload) {
    const edges: string[] = [],
      nodes: string[] = [];
    payload.forEach((val) => {
      const { type, id } = val;
      if (type === 'node') {
        nodes.push(id);
        const keys = this.edgeRef.current?.edgeTree.get(id)?.keys() ?? [];
        edges.push(...keys);
      } else if (type === 'edge') {
        edges.push(id);
      }
    });
    this.props.onDelete(nodes, edges);
  }

  onConnected: ConnectMethodType = (e, targetNode, target) => {
    e.stopPropagation();
    const { active, sourceNode, source } = this.Get(edgeInProgressAtom);
    if (active) {
      this.props.onEdgeCreate({ source, sourceNode, target, targetNode });
    }
    this.resetConnect();
  };

  startReconnecting: ConnectMethodType = (e, nodeId, handleId) => {
    const connectedEdge = this.edgeRef.current?.edgeTree.get(nodeId)?.get(handleId)?.keys();
    if (!connectedEdge) return;
    for (const edge of connectedEdge) {
      if (this.activeItems[edge] && this.activeItems[edge].type === 'edge') {
        const atom = this.getAtom('edge', edge);
        this.Set(atom, (prev) => {
          const next = { ...prev };
          next.reconnect = true;
          return next;
        });
        break;
      }
    }
    return;
  };

  resetConnect = () => {
    this.Reset(edgeInProgressAtom);
    document.removeEventListener('mousemove', this.onConnecting);
    document.removeEventListener('mouseup', this.tryConnect);
  };

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

  getAtom<T extends SelectedItemType>(type: T, id: string): PoolType<T> {
    if (type === 'edge') {
      return getAtom(id, this.edgeRef.current?.edgeAtoms) as PoolType<T>;
    } else {
      return getAtom(id, this.nodeRef.current?.nodeAtoms) as PoolType<T>;
    }
  }
  Set<T>(atom: RecoilState<T>, updater: T | ((cur: T) => T)) {
    return this.nexus.current!.setRecoil<T>(atom, updater); // ! shall be ok
  }
  Get<T>(atom: RecoilValue<T>) {
    return this.nexus.current!.getRecoil<T>(atom);
  }
  Reset(atom: RecoilState<any>) {
    return this.nexus.current!.resetRecoil(atom);
  }
  getNodeAtoms = () => {
    return this.nodeRef.current?.nodeAtoms ?? {};
  };
  getScale = () => {
    return this.viewer.current?.getScale() || 1;
  };
}

export default TailCore;
