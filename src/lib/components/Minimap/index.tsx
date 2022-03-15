import React, { FC } from 'react';
import { MinimapProps } from '@app/types';

const Minimap: FC<MinimapProps> = ({ width, height, nodeColor, activeColor, backgroundColor }) => {
  return (
    <svg className="tail-minimap__container">
      <path className="tail-minimap__mask"></path>
    </svg>
  );
};

export default Minimap;
