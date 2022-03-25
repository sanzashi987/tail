import React, { Component, createRef } from 'react';
import { InterfaceProvider } from '@app/contexts/instance';
import { RecoilState } from 'recoil';
import type {
  InterfaceValue,
  TailCoreProps,
  SelectedItemType,
  EdgeAtom,
  NodeAtom,
  DeletePayload,
  StoreRootInterface,
  SelectModeType,
  IObject,
} from '@app/types';
import { StoreContext } from '@app/contexts/store';
import { findDeletedItem, getAtom } from './mutation';
import ItemActives from './subInstances/itemActives';
import NodeMoves from './subInstances/nodeMoves';
import EdgeConnects from './subInstances/edgeConnects';
import ItemDiffer from './ItemDiffer';
import NodeRenderer from '../NodeRenderer';
import EdgeRenderer from '../EdgeRenderer';
import InfiniteViewer from '../InfiniteViewer';
import MarkerDefs from '../MarkerDefs';
import '@app/styles/index.scss';

class TailCore extends Component<TailCoreProps> {
  static displayName = 'TailCore';
  static defaultProps = {
    dropThreshold: 40,
    quickNodeUpdate: true,
  };
  static contextType = StoreContext;
  context!: StoreRootInterface;

  viewer = createRef<InfiniteViewer>();
  edgeRef = createRef<EdgeRenderer>();
  nodeRef = createRef<NodeRenderer>();
  differRef = createRef<ItemDiffer>();
  contextInterface: InterfaceValue;

  ItemActives: ItemActives;
  NodeMoves: NodeMoves;
  EdgeConnects: EdgeConnects;

  constructor(props: TailCoreProps) {
    super(props);
    const { onEdgeClick, onNodeClick, onEdgeContextMenu, onNodeContextMenu } = props;

    this.ItemActives = new ItemActives(this);
    this.NodeMoves = new NodeMoves(this, this.ItemActives);
    this.EdgeConnects = new EdgeConnects(this, this.ItemActives);

    const { batchNodeDrag, batchNodeDragEnd, onDragStart } = this.NodeMoves;
    const { onHandleMouseUp, onHandleMouseDown } = this.EdgeConnects;

    // context methods are not responsive
    this.contextInterface = {
      edge: { onEdgeClick, onEdgeContextMenu },
      node: {
        onDrag: batchNodeDrag,
        onDragEnd: batchNodeDragEnd,
        onNodeClick,
        onDragStart,
        onNodeContextMenu,
      },
      handle: {
        onMouseDown: onHandleMouseDown,
        onMouseUp: onHandleMouseUp,
      },
      activateItem: this.ItemActives.activateNext,
      getScale: this.getScale,
    };

    props.getMethods?.({
      switchMode: this.switchMode,
      setScale: this.setScale,
      focusNode: this.focusNode,
      getActiveItems: () => this.ItemActives.activeItems,
    });
  }

  setScale = (scale: number) => {
    this.viewer.current?.setScale(scale);
  };

  switchMode = (mode: SelectModeType) => {
    this.viewer.current?.switchMode(mode);
  };

  focusNode = (nodeId: string) => {
    const atom = this.getAtomState<NodeAtom>('node', nodeId);
    if (!atom) return;
    const {
      node: { left, top },
      rect: { width, height },
    } = atom;
    const centerX = left + (isNaN(width) ? 0 : width) / 2;
    const centerY = top + (isNaN(height) ? 0 : height) / 2;
    this.viewer.current?.moveCamera(centerX, centerY);
  };

  render() {
    const {
      nodes,
      edges,
      edgeTemplates,
      connectingEdge,
      nodeTemplates,
      nodeTemplatePicker,
      onViewerDrop,
      markers,
      markerTemplates,
    } = this.props;
    const { set } = this.context;
    const { deactivateLast, batchActivateNodes } = this.ItemActives;
    return (
      <ItemDiffer ref={this.differRef} nodes={nodes} edges={edges} atomSetter={set}>
        <InfiniteViewer
          ref={this.viewer}
          onClick={deactivateLast}
          onSelectEnd={batchActivateNodes}
          onViewerDrop={onViewerDrop}
          outerChildren={this.props.children}
        >
          <InterfaceProvider value={this.contextInterface}>
            <NodeRenderer
              templates={nodeTemplates}
              ref={this.nodeRef}
              templatePicker={nodeTemplatePicker}
            />
            <EdgeRenderer
              ref={this.edgeRef}
              templates={edgeTemplates}
              connectingEdge={connectingEdge}
            >
              <MarkerDefs markers={markers} markerTemplates={markerTemplates} />
            </EdgeRenderer>
          </InterfaceProvider>
        </InfiniteViewer>
      </ItemDiffer>
    );
  }

  deleteItem(payload: DeletePayload) {
    const { nodes, edges } = findDeletedItem(this.edgeRef.current!.edgeTree, payload);
    this.props.onDelete?.(nodes, edges);
  }

  getAtom = <T extends EdgeAtom | NodeAtom>(type: SelectedItemType, id: string) => {
    const pool = type === 'edge' ? this.getEdgeAtoms() : this.getNodeAtoms();
    return getAtom(id, (pool as unknown) as IObject<RecoilState<T>>);
  };

  getAtomState = <T,>(type: SelectedItemType, id: string) => {
    const atom = this.getAtom(type, id);
    if (!atom) return atom;
    return this.context.get((atom as unknown) as RecoilState<T>);
  };

  setAtomState = <T,>(type: SelectedItemType, id: string, updater: T | ((cur: T) => T)) => {
    const atom = this.getAtom(type, id);
    if (!atom) return atom;
    return this.context.set((atom as unknown) as RecoilState<T>, updater);
  };

  getEdgeAtoms = () => this.differRef.current?.differInterface.edgeUpdater.getItemAtoms() ?? {};

  getNodeAtoms = () => this.differRef.current?.differInterface.nodeUpdater.getItemAtoms() ?? {};

  getScale = () => this.viewer.current?.getScale() || 1;
}

export default TailCore;
