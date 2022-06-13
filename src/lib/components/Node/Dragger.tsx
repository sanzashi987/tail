import React from 'react';
import type { DraggerProps, coordinates, DraggerIterState } from '@lib/types';
import { DraggerCore } from '../Dragger';
import { getDraggerRelativeCoordinates } from '../Dragger/utils/calc';

class Dragger extends DraggerCore<DraggerProps, DraggerIterState> {
  last = {
    x: NaN,
    y: NaN,
  };
  mouseDownTime = NaN;

  onDragStart = (e: React.MouseEvent) => {
    const coordniate = this.getEventCoordinate(e);
    const res = this.props.onDragStart(e, { ...coordniate, deltaX: 0, deltaY: 0 });
    const drag = res === false;
    e.stopPropagation();
    this._onMouseDown(e, !drag);
    this.last.x = coordniate.x;
    this.last.y = coordniate.y;
    this.mouseDownTime = e.timeStamp;
  };

  onDrag = (e: MouseEvent) => {
    if (!this.dragging) {
      this.dragging = true;
    }
    e.stopPropagation();
    const coordinates = this.processDrag(this._onMouseMove(e));
    this.props.onDrag(e, coordinates);
  };

  onDragEnd = (e: MouseEvent) => {
    e.stopPropagation();
    if (!this.dragging) {
      this._onMouseUp(e);
      if (e.timeStamp - this.mouseDownTime < 180) {
        this.props.onClick?.(e);
      }
    } else {
      const coordinates = this._onMouseUp(e);
      const data = this.processDrag(coordinates);
      this.props.onDragEnd(e, data);
    }
    this.dragging = false;
  };

  processDrag(coordinates: coordinates) {
    const {
      props: { x, y },
      // state: { lastY, lastX },
      last: { x: lastX, y: lastY },
    } = this;
    const state = getDraggerRelativeCoordinates(x, y, lastX, lastY, coordinates);
    // this.setState(state);
    this.last.x = state.lastX;
    this.last.y = state.lastY;
    return {
      x: Math.round(state.x),
      y: Math.round(state.y),
      deltaX: state.deltaX,
      deltaY: state.deltaY,
    };
  }

  render() {
    const child = React.Children.only(this.props.children);
    return React.cloneElement(child as any, {
      onMouseDown: this.onDragStart,
    });
  }
}

export default Dragger;
