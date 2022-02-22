import React, { ComponentType, FC } from 'react';
import { MarkerWrapperProps, AnchorProps } from '@app/types';

const wrapAnchor = (Symbol: ComponentType<AnchorProps>) => {
  const MarkerWrapper: FC<MarkerWrapperProps> = ({
    id,
    color,
    width = 12.5,
    height = 12.5,
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
        viewBox="-10 -10 20 20"
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
