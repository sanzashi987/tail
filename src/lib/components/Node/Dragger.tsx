import React from 'react';
import type { DraggerProps, coordinates, DraggerIterState } from '@types';
import { DraggerCore } from '../Dragger';
import { getDraggerRelativeCoordinates } from '../Dragger/utils/calc';

class Dragger extends DraggerCore<DraggerProps, DraggerIterState> {
  state: DraggerIterState = {
    // x: NaN,
    // y: NaN,
    lastX: NaN,
    lastY: NaN
  }

  onDragStart = (e: React.MouseEvent) => {
    const coordniate = this._onMouseDown(e);
    const res = this.props.onDragStart(e, coordniate);
    if (res === false) return;
    e.stopPropagation();
    this.setState({
      lastX: coordniate.x,
      lastY: coordniate.y
    });
  }

  onDrag = (e: MouseEvent) => {
    if (!this.dragging) return this.onDragEnd(e);
    e.stopPropagation();
    const coordinates = this.processDrag(this._onMouseMove(e));
    this.props.onDrag(e, coordinates);

  }

  onDragEnd = (e: MouseEvent) => {
    e.stopPropagation();
    let coordinates = this._onMouseUp(e);
    if (!this.dragging) return coordinates;
    coordinates = this.processDrag(coordinates);
    this.props.onDragEnd(e, coordinates);
  }


  processDrag(coordinates: coordinates) {
    const { props: { x, y }, state: { lastY, lastX } } = this;
    const state = getDraggerRelativeCoordinates(x, y, lastX, lastY, coordinates);
    this.setState(state);
    return {
      x: Math.round(state.x),
      y: Math.round(state.y),
    };
  }


  render() {
    const child = React.Children.only(this.props.children);
    return React.cloneElement(child as any, {
      onMouseDown: this.onDragStart
    });
  }
}


export default Dragger;