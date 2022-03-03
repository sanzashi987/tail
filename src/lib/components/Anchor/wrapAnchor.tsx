import React, { ComponentType, FC } from 'react';
import { MarkerWrapperProps, AnchorProps } from '@app/types';

const wrapAnchor = (Symbol: ComponentType<AnchorProps>) => {
  const MarkerWrapper: FC<MarkerWrapperProps> = ({
    id,
    color,
    width = 20,
    height = 20,
    markerUnits = 'strokeWidth',
    strokeWidth,
    orient = 'auto',
  }) => {
    return (
      <marker
        className="tail-marker"
        id={id}
        markerWidth={width}
        markerHeight={height}
        viewBox="-20 -20 40 40"
        markerUnits={markerUnits}
        orient={orient}
        refX="0"
        refY="0"
      >
        <Symbol color={color} strokeWidth={strokeWidth} />
      </marker>
    );
  };

  return MarkerWrapper;
};

export default wrapAnchor;
