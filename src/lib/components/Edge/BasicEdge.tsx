import React, { Component } from 'react';
import type { EdgeProps } from '@app/types';

//Straight Edge
class BasicEdge extends Component<EdgeProps> {
  render() {
    const { sourceX, sourceY, targetX, targetY, markerEnd, markerStart, selected } = this.props;
    return (
      <path
        className="tail-edge__basic"
        d={`M ${sourceX},${sourceY}L ${targetX},${targetY}`}
        // markerEnd={markerEnd}
        markerEnd="url(#tail-marker__basic)"
        markerStart={markerStart}
        stroke={selected ? 'orange' : 'black'}
      />
    );
  }
}

export default BasicEdge;
