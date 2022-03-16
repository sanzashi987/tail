import React, { FC, useContext } from 'react';
import { MinimapProps } from '@app/types';
import { ViewerContext } from '@app/contexts/viewer';
import styles from './index.module.scss';

const { 'minimap-wrapper': c } = styles;

const Minimap: FC<MinimapProps> = ({
  width = 300,
  height = 150,
  nodeColor = '',
  activeColor = 'orange',
  viewportFrameColor = 'orange',
  style = { background: 'wheat' },
}) => {
  const { viewerHeight, viewerWidth, offset, scale } = useContext(ViewerContext);

  return (
    <svg width={width} height={height} className={'tail-minimap__container ' + c} style={style}>
      <path className="tail-minimap__mask"></path>
    </svg>
  );
};

export default Minimap;
