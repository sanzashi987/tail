import React, { FC, useContext, useMemo, useState } from 'react';
import { MinimapProps } from '@app/types';
import { ViewerContext } from '@app/contexts/viewer';
import { isNotNum } from '@app/utils';
import styles from './index.module.scss';
import MiniNode from './MiniNode';

const { 'minimap-wrapper': c } = styles;

const Minimap: FC<MinimapProps> = ({
  width = 200,
  height = 150,
  padding = 30,
  nodeColor = '',
  activeColor = 'orange',
  viewportFrameColor = 'orange',
  style = { background: 'white' },
}) => {
  const {
    viewerHeight,
    viewerWidth,
    offset: { x, y },
    scale,
    setOffset,
  } = useContext(ViewerContext);

  const [horizontal, setHorizontal] = useState([0]);
  const [vertical, setVertical] = useState([0]);
  if (isNotNum(viewerWidth) || isNotNum(viewerHeight)) return null;

  const raww = Math.max(horizontal[0] - horizontal[horizontal.length - 1], viewerWidth);
  const rawh = Math.max(vertical[0] - vertical[vertical.length - 1], viewerHeight);

  const maxRatio = Math.max(raww / width, rawh / height);
  const offset = 5 * maxRatio;

  const [vw, vh] = [width * maxRatio, height * maxRatio];
  

  const [ox, oy] = [x / scale, y / scale];
  return (
    <svg
      width={width}
      height={height}
      className={'tail-minimap__container ' + c}
      style={style}
      viewBox={`${left} ${top} ${vw} ${vh}`}
      onClick={(e) => console.log(e)}
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
        d={`M ${-ox},${-oy} L ${-ox},${viewerHeight / scale - oy} L ${-ox + viewerWidth / scale},${
          viewerHeight / scale - oy
        } L ${viewerWidth / scale - ox}, ${-oy} z `}
      ></path>
    </svg>
  );
};

export default Minimap;
