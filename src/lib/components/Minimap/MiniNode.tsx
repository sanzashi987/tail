import React, { FC } from 'react';
import { MiniNodeProps } from '@app/types';
import { useRecoilValue } from 'recoil';
import { isNotNum } from '@app/utils';

const MiniNode: FC<MiniNodeProps> = ({ atom, activeColor, nodeColor }) => {
  const {
    node: { left, top },
    rect: { width, height },
    selected,
  } = useRecoilValue(atom);
  if (isNotNum(width) || isNotNum(height)) return null;
  const fill = selected ? activeColor : nodeColor;

  return (
    <rect
      className="tail-minimap__mini-node"
      x={left}
      y={top}
      width={width}
      height={height}
      fill={fill}
    ></rect>
  );
};

export default MiniNode;
