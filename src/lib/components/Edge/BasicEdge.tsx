import React, { Component } from 'react';
import type { EdgeProps } from '@app/types';

//Straight Edge
class BasicEdge extends Component<EdgeProps> {
  render() {
    const {
      sourceX,
      sourceY,
      targetX,
      targetY,
      markerEnd,
      markerStart,
      selected,
      hovered,
    } = this.props;
    const stroke = selected ? 'orange' : hovered ? '#bfbfbf' : 'black';
    const width = selected || hovered ? 4 : 1;
    return (
      <path
        className="tail-edge__basic"
        style={{transition:'all 0.2s linear'}}
        d={`M ${sourceX},${sourceY}L ${targetX},${targetY}`}
        // markerEnd={markerEnd}
        markerEnd="url(#tail-marker__basic)"
        markerStart={markerStart}
        stroke={stroke}
        strokeWidth={width}
      />
    );
  }
}

export default BasicEdge;
