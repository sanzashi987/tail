import React, { Component } from 'react';
import { MinimapProps, MinimapState, ViewerContextType, Box, NodeAtom } from '@app/types';
import { ViewerContext } from '@app/contexts/viewer';
import { isNotNum } from '@app/utils';
import type { RecoilState } from 'recoil';
import styles from './index.module.scss';
import MiniNode from './MiniNode';
import { binaryUpdateBox, getLargeBox, toBox, toRect } from './utils';

const { 'minimap-wrapper': c } = styles;

class Minimap extends Component<MinimapProps, MinimapState> {
  static contextType = ViewerContext;
  context!: ViewerContextType;
  static defaultProps = {
    width: 200,
    height: 150,
    nodeColor: '',
    activeColor: 'orange',
    viewportFrameColor: 'orange',
    style: { background: 'white' },
  };

  state: MinimapState = {
    sortedX: [10, 1712],
    sortedY: [20, 892],
  };

  mountNode = (id: string, atom: RecoilState<NodeAtom>) => {};
  unmountNode = (id: string, atom: RecoilState<NodeAtom>) => {};

  updateBox = (box: Box, lastBox?: Box) => {
    const sortedX = [...this.state.sortedX];
    const sortedY = [...this.state.sortedY];
    binaryUpdateBox(sortedX, sortedY, box, lastBox);
    this.setState({ sortedX, sortedY });
  };

  getMinimapInfo() {
    const {
      viewerHeight,
      viewerWidth,
      offset: { x, y },
      scale,
    } = this.context;
    const { width, height } = this.props;
    const { sortedX, sortedY } = this.state;
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
    const {
      x: boundingX,
      y: boundingY,
      width: boundingWidth,
      height: boundingHeight,
    } = toRect(boundingBox);
    const maxRatio = Math.max(boundingWidth / width!, boundingHeight / height!);

    const offset = 5 * maxRatio;
    let [vw, vh] = [width! * maxRatio, height! * maxRatio];
    const left = boundingX - (vw - boundingWidth) / 2 - offset;
    const top = boundingY - (vh - boundingHeight) / 2 - offset;
    [vw, vh] = [vw + offset * 2, vh + offset * 2];

    return { left, top, vw, vh, viewerRect, offset };
  }

  render() {
    const { viewerHeight, viewerWidth, scale } = this.context;
    if (isNotNum(viewerWidth) || isNotNum(viewerHeight)) return null;
    const { width, height, style, viewportFrameColor } = this.props;
    const { left, top, vw, vh, viewerRect, offset } = this.getMinimapInfo();
    return (
      <svg
        width={width}
        height={height}
        className={'tail-minimap__container ' + c}
        style={style}
        viewBox={`${left} ${top} ${vw} ${vh}`}
      >
        <rect
          className="tail-minimap__mini-node"
          x={10}
          y={20}
          width={202}
          height={42}
          fill={'black'}
        />
        <rect
          className="tail-minimap__mini-node"
          x={1510}
          y={850}
          width={202}
          height={42}
          fill={'black'}
        />
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
  }
}

export default Minimap;
