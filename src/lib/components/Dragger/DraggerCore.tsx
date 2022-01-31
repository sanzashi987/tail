import React, { Component } from 'react';
import { getCoordinatesFromParent } from './utils/calc';
import type { DraggerCoreBasic } from './utils/types';
import { addUserSelectStyles, removeUserSelectStyles } from './utils/domFns';

const options = { capture: true, passive: false };
class DraggerCore<T extends DraggerCoreBasic = DraggerCoreBasic> extends Component<T> {
  dragging = false;

  _onMouseDown = (e: React.MouseEvent) => {
    // only left click triggers the drag simulation
    if (!this.dragging && e.button === 0) {
      document.addEventListener('mousemove', this.onDrag, options);
      document.addEventListener('mouseup', this.onDragEnd, options);
      this.dragging = true;
      addUserSelectStyles(document);
    }
    return this.getEventCoordinate(e);
  };

  onDrag = (e: MouseEvent) => {
    this._onMouseMove(e);
  };

  onDragEnd = (e: MouseEvent) => {
    this._onMouseUp(e);
  };

  _onMouseMove = (e: MouseEvent) => {
    if (!this.dragging) return;
    return this.getEventCoordinate(e);
  };

  getOffsetRef() {
    return this.props.nodeRef?.current?.offsetParent ?? document.body;
  }

  getEventCoordinate(e: MouseEvent | React.MouseEvent) {
    const scale = this.props.getScale?.() ?? 1;
    const offsetParent = this.getOffsetRef();
    return getCoordinatesFromParent(e, offsetParent, scale);
  }

  _onMouseUp = (e: MouseEvent) => {
    if (!this.dragging) return;
    this.dragging = false;
    removeUserSelectStyles(document);
    document.removeEventListener('mousemove', this.onDrag, options);
    document.removeEventListener('mouseup', this.onDragEnd, options);
    return this.getEventCoordinate(e);
  };

  render(): React.ReactNode {
    return null;
  }
}

export default DraggerCore;
