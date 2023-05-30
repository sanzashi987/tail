import React, { Component, createRef, forwardRef, useImperativeHandle, useRef } from 'react';
import type {
  InterfaceValue,
  TailCoreProps,
  SelectModeType,
  CoreMethods,
  TailProps,
  ItemParserInterface,
  SelectCallback,
} from '@lib/types';
import { ParserContext, InterfaceProvider } from '@lib/contexts';
import { NodeMoves, EdgeConnects } from './callbackFactory';
import { getInsideIds } from './helpers';
import ItemParser from '../../components/ItemParser';
import NodeRenderer from '../NodeRenderer';
import EdgeRenderer from '../EdgeRenderer';
import InfiniteViewer from '../InfiniteViewer';
import MarkerDefs from '../MarkerDefs';
import '@lib/styles/index.scss';

class TailCore extends Component<TailCoreProps> {
  static offsetFallback = { x: 0, y: 0 };

  static defaultProps = {
    quickNodeUpdate: true,
    lazyRenderNodes: true,
  };
  static contextType = ParserContext;

  context!: ItemParserInterface;
  viewer = createRef<InfiniteViewer>();
  Interface: InterfaceValue;

  constructor(props: TailCoreProps) {
    super(props);
    const { onEdgeClick, onNodeClick, onEdgeContextMenu, onNodeContextMenu } = props;
    const { batchNodeDragStart, batchNodeDrag, batchNodeDragEnd } = new NodeMoves(this);
    const { onHandleMouseUp, onHandleMouseDown } = new EdgeConnects(this);

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
      getScale: this.getScale,
    };
  }

  getScale = () => this.viewer.current?.getScale() || 1;

  getOffset = () => this.viewer.current?.getOffset();

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
    const res = getInsideIds(
      Object.keys(this.context.nodeUpdater.getAtoms()),
      this.context.nodeUpdater.getState,
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
        onViewerScale={this.props.onViewerScale}
        outerChildren={this.props.children}
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
  ({ children, nodes, edges, activeEdges, activeNodes, ...otherprops }, ref) => {
    const coreRef = useRef<TailCore>(null);
    useImperativeHandle(
      ref,
      () => ({
        setScale: (s) => coreRef.current?.setScale(s),
        switchMode: (t) => coreRef.current?.switchMode(t),
        focusNode: (i) => coreRef.current?.focusNode(i),
        getEdgeTree: () => coreRef.current?.context.edgeUpdater.edgeTree ?? new Map(),
        moveViewCenter: (x, y) => coreRef.current?.viewer.current?.moveCamera(x, y),
        getOffSet: () => coreRef.current?.getOffset() ?? TailCore.offsetFallback,
      }),
      [],
    );
    return (
      <ItemParser nodes={nodes} edges={edges} activeNodes={activeNodes} activeEdges={activeEdges}>
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
