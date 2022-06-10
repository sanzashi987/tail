import React, { Component, createRef, forwardRef, useImperativeHandle, useRef } from 'react';
import type {
  InterfaceValue,
  TailCoreProps,
  NodeAtom,
  SelectModeType,
  CoreMethods,
  TailProps,
  ItemParserInterface,
  SelectCallback,
} from '@lib/types';
import { ParserContext, InterfaceProvider } from '@lib/contexts';
import { noop } from '@lib/utils/converter';
import { ItemActives, NodeMoves, EdgeConnects } from './subInstances';
import { getInsideIds } from './helpers';
import ItemParser from '../../components/ItemParser';
import NodeRenderer from '../NodeRenderer';
import EdgeRenderer from '../EdgeRenderer';
import InfiniteViewer from '../InfiniteViewer';
import MarkerDefs from '../MarkerDefs';
import '@lib/styles/index.scss';

class TailCore extends Component<TailCoreProps> {
  static displayName = 'TailCore';
  static defaultProps = {
    quickNodeUpdate: true,
    lazyRenderNodes: true,
  };
  static contextType = ParserContext;

  context!: ItemParserInterface;
  viewer = createRef<InfiniteViewer>();
  Interface: InterfaceValue;

  NodeMoves: NodeMoves;
  EdgeConnects: EdgeConnects;

  constructor(props: TailCoreProps) {
    super(props);
    const { onEdgeClick, onNodeClick, onEdgeContextMenu, onNodeContextMenu } = props;
    this.NodeMoves = new NodeMoves(this);
    this.EdgeConnects = new EdgeConnects(this, this.ItemActives);

    const { batchNodeDragStart, batchNodeDrag, batchNodeDragEnd } = this.NodeMoves;
    const { onHandleMouseUp, onHandleMouseDown } = this.EdgeConnects;

    // context methods are not responsive
    this.Interface = {
      edge: { onEdgeClick, onEdgeContextMenu },
      node: {
        onDrag: batchNodeDrag,
        onDragEnd: batchNodeDragEnd,
        onNodeClick,
        onDragStart: batchNodeDragStart,
        onNodeContextMenu,
      },
      handle: {
        onMouseDown: onHandleMouseDown,
        onMouseUp: onHandleMouseUp,
      },
      activateItem: this.props.onActivate ?? noop,
      getScale: this.getScale,
    };
  }

  getScale = () => this.viewer.current?.getScale() || 1;

  setScale = (scale: number) => {
    this.viewer.current?.setScale(scale);
  };

  switchMode = (mode: SelectModeType) => {
    this.viewer.current?.switchMode(mode);
  };

  focusNode = (nodeId: string) => {
    const nodeState = this.context.nodeUpdater.getState(nodeId);
    if (!nodeState) return;
    const {
      node: { left, top },
      rect: { width, height },
    } = nodeState;
    const centerX = left + (isNaN(width) ? 0 : width) / 2;
    const centerY = top + (isNaN(height) ? 0 : height) / 2;
    this.viewer.current?.moveCamera(centerX, centerY);
  };

  onSelectEnd: SelectCallback = (e, topLeft, bottomRight, offset, scale) => {
    const { getAtoms, getState } = this.context.nodeUpdater;
    const res = getInsideIds(
      Object.keys(getAtoms()),
      getState,
      topLeft,
      bottomRight,
      offset,
      scale,
    );
    this.props.onSelect?.(e, res);
  };

  render() {
    const {
      edgeTemplates,
      connectingEdge,
      nodeTemplates,
      nodeTemplatePicker,
      onViewerDrop,
      onViewerClick,
      markers,
      markerTemplates,
    } = this.props;
    return (
      <InfiniteViewer
        ref={this.viewer}
        onSelectEnd={this.onSelectEnd}
        onViewerDrop={onViewerDrop}
        onViewerClick={onViewerClick}
        outerChildren={this.props.children}
        onViewerScale={this.props.onViewerScale}
      >
        <InterfaceProvider value={this.Interface}>
          <NodeRenderer templates={nodeTemplates} templatePicker={nodeTemplatePicker} />
          <EdgeRenderer templates={edgeTemplates} connectingEdge={connectingEdge}>
            <MarkerDefs markers={markers} markerTemplates={markerTemplates} />
          </EdgeRenderer>
        </InterfaceProvider>
      </InfiniteViewer>
    );
  }
}

const Tail = forwardRef<CoreMethods, TailProps>(
  ({ children, nodes, edges, ...otherprops }, ref) => {
    const coreRef = useRef<TailCore>(null);
    useImperativeHandle(
      ref,
      () => ({
        setScale: (s) => coreRef.current?.setScale(s),
        switchMode: (t) => coreRef.current?.switchMode(t),
        focusNode: (i) => coreRef.current?.focusNode(i),
        getEdgeTree: () => coreRef.current?.context.edgeUpdater.edgeTree ?? new Map(),
        moveViewCenter: (x, y) => coreRef.current?.viewer.current?.moveCamera(x, y),
      }),
      [],
    );
    return (
      <ItemParser nodes={nodes} edges={edges}>
        <TailCore ref={coreRef} {...otherprops}>
          {children}
        </TailCore>
      </ItemParser>
    );
  },
);

Tail.displayName = 'Tail';

export { Tail };
export default TailCore;
