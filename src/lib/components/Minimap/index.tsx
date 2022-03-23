import React, { FC, Component, ReactNode } from 'react';
import {
  MinimapProps,
  MinimapState,
  ViewerContextType,
  Box,
  NodeAtom,
  Node,
  ItemDifferInterface,
  MapContainerProps,
} from '@app/types';
import { ViewerContext, ViewerConsumer, ViewerProvider } from '@app/contexts/viewer';
import { DifferContext } from '@app/contexts/differ';
import { isNotNum } from '@app/utils';
import type { RecoilState } from 'recoil';
import styles from './index.module.scss';
import MiniNode from './MiniNode';
import { binaryUpdateBox, getLargeBox, toBox, toRect } from './utils';

const { 'minimap-wrapper': c } = styles;

const MapContainer: FC<MapContainerProps> = ({
  width,
  height,
  style,
  viewportFrameColor,
  sortedX,
  sortedY,
  children,
}) => {
  return (
    <ViewerConsumer>
      {({ viewerHeight, viewerWidth, offset: { x, y }, scale }) => {
        if (isNotNum(viewerWidth) || isNotNum(viewerHeight)) return null;
        const viewerRect = {
          x: -x / scale,
          y: -y / scale,
          width: viewerWidth / scale,
          height: viewerHeight / scale,
        };
        const viewerBox = toBox(viewerRect);
        const boundingBox =
          sortedX.length === 0 || sortedY.length === 0
            ? viewerBox
            : getLargeBox(viewerBox, {
                x: sortedX[0],
                y: sortedY[0],
                x2: sortedX[sortedX.length - 1],
                y2: sortedY[sortedY.length - 1],
              });
        const { x: boundingX, y: boundingY, width: boundingWidth, height: boundingHeight } = toRect(
          boundingBox,
        );
        const maxRatio = Math.max(boundingWidth / width!, boundingHeight / height!);

        const offset = 5 * maxRatio;
        let [vw, vh] = [width! * maxRatio, height! * maxRatio];
        const left = boundingX - (vw - boundingWidth) / 2 - offset;
        const top = boundingY - (vh - boundingHeight) / 2 - offset;
        [vw, vh] = [vw + offset * 2, vh + offset * 2];
        return (
          <svg
            width={width}
            height={height}
            className={'tail-minimap__container ' + c}
            style={style}
            viewBox={`${left} ${top} ${vw} ${vh}`}
          >
            {children}
            <path
              className="tail-minimap__viewport"
              fill="none"
              strokeWidth={3 / scale}
              stroke={viewportFrameColor}
              d={`
          M${left - offset},${top - offset}h${vw + offset * 2}v${vh + offset * 2}h${
                -vw - offset * 2
              }z
          M${viewerRect.x},${viewerRect.y}h${viewerRect.width}v${
                viewerRect.height
              }h${-viewerRect.width}z
        `}
            ></path>
          </svg>
        );
      }}
    </ViewerConsumer>
  );
};

class Minimap extends Component<MinimapProps, MinimapState> {
  static contextType = DifferContext;
  context!: ItemDifferInterface;
  static defaultProps = {
    width: 200,
    height: 150,
    nodeColor: '',
    activeColor: 'orange',
    viewportFrameColor: 'orange',
    style: { background: 'white' },
  };

  nodeInstances: IObject<ReactNode> = {};
  memoNodes: ReactNode;

  state: MinimapState = {
    sortedX: [10, 1712],
    sortedY: [20, 892],
  };

  mountNode = (node: Node, atom: RecoilState<NodeAtom>) => {
    const { activeColor, nodeColor } = this.props;
    this.nodeInstances[node.id] = (
      <MiniNode
        atom={atom}
        activeColor={activeColor!}
        nodeColor={nodeColor!}
        updateBox={this.updateBox}
      />
    );
  };
  unmountNode = (node: Node) => {
    delete this.nodeInstances[node.id];
  };

  updateMemoNodes = () => {
    this.memoNodes = Object.keys(this.nodeInstances).map((k) => this.nodeInstances[k]);
    this.forceUpdate();
  };

  updateBox = (box: Box, lastBox?: Box) => {
    const sortedX = [...this.state.sortedX];
    const sortedY = [...this.state.sortedY];
    binaryUpdateBox(sortedX, sortedY, box, lastBox);
    this.setState({ sortedX, sortedY });
  };

  componentDidMount() {
    // setTimeout(() => {
    this.context.nodeUpdater.on('mount', this.mountNode);
    this.context.nodeUpdater.on('delete', this.unmountNode);
    this.context.nodeUpdater.on('sizeChange', this.updateMemoNodes);
    this.updateMemoNodes();
    // }, 1000);
  }

  render() {
    const { width, height, style, viewportFrameColor } = this.props;
    const { sortedX, sortedY } = this.state;
    return (
      <MapContainer
        width={width!}
        height={height!}
        style={style!}
        viewportFrameColor={viewportFrameColor!}
        sortedX={sortedX}
        sortedY={sortedY}
      >
        {this.memoNodes}
      </MapContainer>
    );
  }
}

export default Minimap;
