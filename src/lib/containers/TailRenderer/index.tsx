import React, { Component, createRef } from 'react';
import { InterfaceProvider } from '@app/contexts/instance';
import { RecoilState } from 'recoil';
import type {
  SelectedItemCollection,
  InterfaceValue,
  TailCoreProps,
  SelectedItemType,
  EdgeAtom,
  NodeAtom,
  DeletePayload,
  StoreRootInterface,
} from '@types';
import { StoreContext } from '@app/contexts/store';
import { findDeletedItem, getAtom } from './mutation';
import ItemActives from './subInstances/itemActives';
import NodeMoves from './subInstances/nodeMoves';
import EdgeConnects from './subInstances/edgeConnects';
import NodeRenderer from '../NodeRenderer';
import EdgeRenderer from '../EdgeRenderer';
import InfiniteViewer from '../InfiniteViewer';
import MarkerDefs from '../MarkerDefs';
import '@app/styles/index.scss';

const emptyActives = { node: {}, edge: {} };

class TailCore extends Component<TailCoreProps> {
  static contextType = StoreContext;
  context!: StoreRootInterface;
  state = { nodesReady: false };

  activeItems: SelectedItemCollection = emptyActives;
  viewer = createRef<InfiniteViewer>();
  edgeRef = createRef<EdgeRenderer>();
  nodeRef = createRef<NodeRenderer>();
  contextInterface: InterfaceValue;

  ItemActives: ItemActives;
  NodeMoves: NodeMoves;
  EdgeConnects: EdgeConnects;

  constructor(props: TailCoreProps) {
    super(props);
    const { onEdgeClick, onDragStart, onNodeClick } = props;

    // TODO DI
    this.NodeMoves = new NodeMoves(this);
    this.ItemActives = new ItemActives(this);
    this.EdgeConnects = new EdgeConnects(this, this.ItemActives);

    const { batchNodeDrag, batchNodeDragEnd } = this.NodeMoves;
    const { onHandleMouseUp, onHandleMouseDown } = this.EdgeConnects;

    // context methods are not responsive
    this.contextInterface = {
      edge: { onEdgeClick },
      node: {
        onDrag: batchNodeDrag,
        onDragEnd: batchNodeDragEnd,
        onNodeClick,
        onDragStart,
      },
      handle: {
        onMouseDown: onHandleMouseDown,
        onMouseUp: onHandleMouseUp,
      },
      activateItem: this.ItemActives.activateNext,
      getScale: this.getScale,
    };
  }

  deactiveAll = () => {
    this.ItemActives.deactivateLast();
  };

  render() {
    const { nodes, edges, nodeTemplates, nodeTemplatePicker } = this.props;
    const { set } = this.context;
    return (
      <InfiniteViewer
        ref={this.viewer}
        onClick={this.deactiveAll}
        onSelectEnd={this.ItemActives.batchActivateNodes}
      >
        <InterfaceProvider value={this.contextInterface}>
          <NodeRenderer
            templates={nodeTemplates}
            nodes={nodes}
            ref={this.nodeRef}
            templatePicker={nodeTemplatePicker}
            mounted={() => this.setState({ nodesReady: true })}
            storeUpdater={set}
          />
          {this.state.nodesReady && (
            <EdgeRenderer
              edges={edges}
              ref={this.edgeRef}
              getNodeAtoms={this.getNodeAtoms}
              storeUpdater={set}
            >
              <MarkerDefs />
            </EdgeRenderer>
          )}
        </InterfaceProvider>
        {this.props.children}
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

  getEdgeAtoms = () => this.edgeRef.current?.edgeAtoms ?? {};

  getNodeAtoms = () => this.nodeRef.current?.nodeAtoms ?? {};

  getScale = () => this.viewer.current?.getScale() || 1;
}

export default TailCore;
