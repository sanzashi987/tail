import React, { FC, useEffect, useMemo, useRef } from 'react';
import { MiniNodeProps, Box } from '@lib/types';
import { useAtomValue } from 'jotai';
import { isNotNum } from '@lib/utils';
import { toBox } from './utils';

const MiniNode: FC<MiniNodeProps> = ({ atom, activeColor, nodeColor, updateBox, removeBox }) => {
  const {
    node: { left: x, top: y },
    rect: { width, height },
    selected,
  } = useAtomValue(atom);
  const lastBox = useRef<Box>();
  const nodeBox = toBox({ x, y, width, height });
  useEffect(() => {
    if (isNotNum(width) || isNotNum(height)) return;
    updateBox(nodeBox, lastBox.current);
    lastBox.current = nodeBox;
  }, [x, y, nodeBox.x2, nodeBox.y2]);

  useEffect(() => {
    return () => lastBox.current && removeBox(lastBox.current);
  }, []);

  const fill = selected ? activeColor : nodeColor;
  const Node = useMemo(() => {
    if (isNotNum(width) || isNotNum(height)) return null;
    return (
      <rect
        className="tail-minimap__mini-node"
        x={x}
        y={y}
        width={width}
        height={height}
        fill={fill}
      />
    );
  }, [x, y, width, height, fill]);

  return Node;
};

export default MiniNode;
