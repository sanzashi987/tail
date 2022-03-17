import React, { FC } from 'react';
import { EdgeBasicProps, EdgeProps } from '@app/types';
import { drawBezier } from './drawBezier';

const getCenter = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
}: EdgeBasicProps): [number, number, number, number] => {
  const xOffset = Math.abs(targetX - sourceX) / 2;
  const centerX = targetX < sourceX ? targetX + xOffset : targetX - xOffset;

  const yOffset = Math.abs(targetY - sourceY) / 2;
  const centerY = targetY < sourceY ? targetY + yOffset : targetY - yOffset;

  return [centerX, centerY, xOffset, yOffset];
};

const BezierEdge: FC<EdgeProps> = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  markerEnd,
  markerStart,
  selected,
  hovered,
}) => {
  const path = drawBezier({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

  const stroke = selected ? 'orange' : hovered ? '#bfbfbf' : 'black';
  const width = selected || hovered ? 4 : 1;

  return (
    <path
      className="tail-edge__bezier"
      style={{ transition: 'stroke-width 0.2s linear' }}
      d={path}
      // markerEnd={markerEnd}
      markerEnd="url(#tail-marker__basic)"
      markerStart={markerStart}
      stroke={stroke}
      strokeWidth={width}
    />
  );
};

export default BezierEdge;
