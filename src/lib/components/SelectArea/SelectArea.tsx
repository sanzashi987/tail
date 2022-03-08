import React, { FC } from 'react';
import type { SelectAreaProps } from '@types';
import Style from './SelectArea.module.scss';

const SelectArea: FC<SelectAreaProps> = ({ dragEnd: { x, y }, dragStart, offsetSnap, offset }) => {
  const sx = dragStart.x + offsetSnap.x - offset.x;
  const sy = dragStart.y + offsetSnap.y - offset.y;
  const d = `M ${x},${y} L ${x},${sy} L ${sx},${sy} L ${sx},${y} z`;
  return (
    <svg className={Style['select-area']}>
      <g>
        <path
          className="select-area"
          fill="none"
          d={d}
          strokeWidth="0"
          // strokeDasharray="4,1"
        ></path>
      </g>
    </svg>
  );
};

export default SelectArea;
