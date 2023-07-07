import React, { Component, createRef } from 'react';
import type {
  MinimapProps,
  MinimapState,
  Box,
  NodeAtomState,
  Node,
  MapContainerProps,
  ViewerContextType,
  MapBoundary,
  DraggerData,
  MapContainerState,
  JotaiImmerAtom,
} from '@lib/types';
import { ViewerContext } from '@lib/contexts/viewer';
import { isNotNum } from '@lib/utils';
import BasicRenderer from '@lib/containers/BasicRenderer';
import styles from './index.module.scss';
import MiniNode from './MiniNode';
import { binaryRemoveBox, binaryUpdateBox, getLargeBox, toBox, toRect } from './utils';
import { CoordinateCalc } from '../Dragger';

const { 'minimap-wrapper': c } = styles;
class MapContainer extends Component<MapContainerProps, MapContainerState> {
  static contextType = ViewerContext;
  declare context: ViewerContextType;
  state = { lockBoundary: false };

  dragger = new CoordinateCalc();
  containerRef = createRef<SVGSVGElement>();
  boundarySnap: MapBoundary = null;

  lockBoundary = (lock: boolean) => {
    if (this.props.realtimeBoundary) return;
    this.setState({ lockBoundary: lock });
  };

  calculateBoundary() {
    const { viewerHeight, viewerWidth } = this.context;
    if (isNotNum(viewerHeight) || isNotNum(viewerWidth)) return null;
    const { sortedX, sortedY, width, height } = this.props;
    const viewerRect = this.getViewerRect();
    const viewerBox = toBox(viewerRect);
    const boundaryBox =
      sortedX.length === 0 || sortedY.length === 0
        ? viewerBox
        : getLargeBox(viewerBox, {
            x: sortedX[0],
            y: sortedY[0],
            x2: sortedX[sortedX.length - 1],
            y2: sortedY[sortedY.length - 1],
          });
    const {
      x: boundaryX,
      y: boundaryY,
      width: boundaryWidth,
      height: boundaryHeight,
    } = toRect(boundaryBox);
    const maxRatio = Math.max(boundaryWidth / width!, boundaryHeight / height!);
    const [vw, vh] = [width! * maxRatio, height! * maxRatio];
    const left = boundaryX - (vw - boundaryWidth) / 2;
    const top = boundaryY - (vh - boundaryHeight) / 2;
    return {
      left,
      top,
      vw,
      vh,
      maxRatio,
    };
  }

  getViewerRect() {
    const {
      viewerHeight,
      viewerWidth,
      offset: { x, y },
      scale,
    } = this.context;
    return {
      x: -x / scale,
      y: -y / scale,
      width: viewerWidth / scale,
      height: viewerHeight / scale,
    };
  }

  dragStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const mapBoundary = this.calculateBoundary();
    if (!mapBoundary) return;
    this.boundarySnap = mapBoundary;
    const { scale } = this.context;
    const { x, x2, y, y2 } = toBox(this.getViewerRect());
    const [centerX, centerY] = [(x + x2) / 2, (y + y2) / 2];
    const { left, top, maxRatio } = mapBoundary;
    const { clientX, clientY } = e;
    const rect = this.containerRef.current!.getBoundingClientRect();
    const affineX = (clientX - rect.left) * maxRatio + left;
    const affineY = (clientY - rect.top) * maxRatio + top;
    this.context.setOffset((prev) => {
      return {
        x: prev.x + (centerX - affineX) * scale,
        y: prev.y + (centerY - affineY) * scale,
      };
    });
    this.lockBoundary(true);
    // this.setState({ lockBoundary: true });
    this.dragger.start(e, {
      movecb: this.drag,
      endcb: this.dragEnd,
      endOpt: {
        capture: true,
      },
    });
  };

  drag = (e: MouseEvent, { deltaX, deltaY }: DraggerData) => {
    const { scale } = this.context;
    const { maxRatio } = this.boundarySnap!;
    this.context.setOffset((prev) => {
      let { x, y } = prev;
      x -= deltaX * maxRatio * scale;
      y -= deltaY * maxRatio * scale;
      return { x, y };
    });
  };

  dragEnd = (e: MouseEvent, d: DraggerData) => {
    this.drag(e, d);
    this.lockBoundary(false);
    // this.setState({ lockBoundary: false });
  };

  render() {
    const mapBoundary = this.state.lockBoundary ? this.boundarySnap : this.calculateBoundary();
    if (!mapBoundary) return null;
    const viewerRect = this.getViewerRect();
    const { style, viewportFrameColor, width, height } = this.props;
    const { left, top, vh, vw, maxRatio } = mapBoundary;
    return (
      <svg
        ref={this.containerRef}
        width={width}
        height={height}
        className={'tail-minimap__container ' + c}
        style={style}
        onMouseDown={this.dragStart}
        viewBox={`${left} ${top} ${vw} ${vh}`}
      >
        {this.props.children}
        <path
          className="tail-minimap__viewport"
          fill="none"
          strokeWidth={1 * maxRatio}
          stroke={viewportFrameColor}
          d={`
          M${viewerRect.x},${viewerRect.y}h${viewerRect.width}v${
            viewerRect.height
          }h${-viewerRect.width}z
        `}
        ></path>
      </svg>
    );
  }
}

class Minimap extends BasicRenderer<MinimapProps, MinimapState> {
  static defaultProps = {
    width: 200,
    height: 150,
    nodeColor: '',
    activeColor: 'orange',
    viewportFrameColor: 'orange',
    style: { background: 'white' },
  };
  state: MinimapState = {
    sortedX: [],
    sortedY: [],
  };

  mountNode = (node: Node, atom: JotaiImmerAtom<NodeAtomState>) => {
    const { activeColor, nodeColor } = this.props;
    this.itemInstances[node.id] = (
      <MiniNode
        key={node.id}
        atom={atom}
        activeColor={activeColor!}
        nodeColor={nodeColor!}
        updateBox={this.updateBox}
        removeBox={this.removeBox}
      />
    );
  };
  unmountNode = (node: Node) => {
    delete this.itemInstances[node.id];
  };

  removeBox = (box: Box) => {
    this.setState(({ sortedX, sortedY }) => {
      const sortedNewX = [...sortedX];
      const sortedNewY = [...sortedY];
      binaryRemoveBox(sortedNewX, sortedNewY, box);
      return {
        sortedX: sortedNewX,
        sortedY: sortedNewY,
      };
    });
  };

  updateBox = (box: Box, lastBox?: Box) => {
    this.setState(({ sortedX, sortedY }) => {
      const sortedNewX = [...sortedX];
      const sortedNewY = [...sortedY];
      binaryUpdateBox(sortedNewX, sortedNewY, box, lastBox);
      return {
        sortedX: sortedNewX,
        sortedY: sortedNewY,
      };
    });
  };

  componentDidMount() {
    this.context.nodeUpdater.on('mount', this.mountNode);
    this.context.nodeUpdater.on('delete', this.unmountNode);
    this.context.nodeUpdater.on('rerender', this.updateMemoVNodes);
  }

  render() {
    const { width, height, style, viewportFrameColor, realtimeBoundary } = this.props;
    const { sortedX, sortedY } = this.state;
    // console.log('sorted', sortedX, sortedY);
    return (
      <MapContainer
        width={width!}
        height={height!}
        style={style!}
        viewportFrameColor={viewportFrameColor!}
        sortedX={sortedX}
        sortedY={sortedY}
        realtimeBoundary={realtimeBoundary}
      >
        {this.memoVNodes}
      </MapContainer>
    );
  }
}

export default Minimap;
