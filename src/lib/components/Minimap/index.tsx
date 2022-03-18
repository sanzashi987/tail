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

  // sorted value
  const [sortedX, setSortedX] = useState([0]);
  const [sortedY, setSortedY] = useState([0]);
  if (isNotNum(viewerWidth) || isNotNum(viewerHeight)) return null;

  const [viewerX, viewerY] = [-x / scale, -y / scale];
  const [viewerXEnd, viewerYEnd] = [viewerX + viewerWidth / scale, viewerY + viewerHeight / scale];

  const [boundingX, boundingY] = [Math.min(viewerX, sortedX[0]), Math.min(viewerY, sortedY[0])];
  const boundingXEnd = Math.max(viewerXEnd, sortedX[sortedX.length - 1]);
  const boundingYEnd = Math.max(viewerYEnd, sortedY[sortedY.length - 1]);

  const [boundingWidth, boundingHeight] = [boundingXEnd - boundingX, boundingYEnd - boundingY];
  const maxRatio = Math.max(boundingWidth / width, boundingHeight / height);

  const offset = 5 * maxRatio;
  let [vw, vh] = [width * maxRatio, height * maxRatio];
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
          M${viewerX},${viewerY}h${viewerXEnd - viewerX}v${viewerYEnd - viewerY}h${-(
          viewerXEnd - viewerX
        )}z
        `}
      ></path>
    </svg>
  );
};

export default Minimap;
