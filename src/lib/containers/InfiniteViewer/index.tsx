import React, { Component, createRef } from 'react';
import type { DraggerData, InfiniteViewerProps, InfiniteViewerState } from '@types';
import ResizeObserver from 'resize-observer-polyfill';
import { CoordinateCalc } from '@app/components/Dragger';
import styles from './index.module.scss';
import { getCSSVar } from './utils';

class InfiniteViewer extends Component<InfiniteViewerProps, InfiniteViewerState> {
  public observer: ResizeObserver | undefined;
  ref = createRef<HTMLDivElement>();
  container = createRef<HTMLDivElement>();

  state: InfiniteViewerState = {
    scale: 1,
    offset: { x: 0, y: 0 },
    selectMode: 'single',
  };

  dragger = new CoordinateCalc();

  getScale() {
    return this.state.scale;
  }

  componentDidMount() {
    this.observer = new ResizeObserver(this.onDomResize);
    this.observer.observe(this.ref.current!);
  }

  componentWillUnmount() {
    this.observer?.disconnect();
  }

  onWheeling = (e: React.WheelEvent) => {
    if (this.state.selectMode === 'single') {
      this.scaling(e);
    }
  };

  onDomResize = () => {
    return;
  };

  onMouseDown = (e: React.MouseEvent) => {
    if (this.state.selectMode === 'single') {
      this.onDragStart(e);
    } else if (this.state.selectMode === 'select') {
      return;
    }
  };

  onDragStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    this.dragger.start(e, {
      x: 0,
      y: 0,
      parent: document.body,
      getScale: () => 1,
      movecb: this.onMove,
      endcb: this.onEnd,
      moveOpt: {},
      endOpt: { capture: true },
    });
  };

  onEnd = (e: MouseEvent) => {
    e.stopPropagation();
  };

  onMove = (e: MouseEvent, { deltaX, deltaY }: DraggerData) => {
    this.setState((prev) => ({
      ...prev,
      offset: {
        x: prev.offset.x + deltaX,
        y: prev.offset.y + deltaY,
      },
    }));
  };

  deactivate = (e: React.MouseEvent) => {
    if (Array.from(this.container.current?.children ?? []).includes(e.target as any)) {
      e.stopPropagation();
      this.props.deactivateAll();
    }
  };

  scaling = (e: React.WheelEvent) => {
    const { deltaY, clientY, clientX } = e;
    const rec = this.ref.current?.getBoundingClientRect() ?? { x: 0, y: 0 };
    const [mouseX, mouseY] = [clientX - rec.x, clientY - rec.y];
    const {
      offset: { x, y },
      scale: preScale,
    } = this.state;
    const nextScale = preScale + (deltaY > 0 ? 1 : -1) * 0.08;
    if (nextScale < 0.2 || nextScale > 4) return;
    const ix = (mouseX - x) / preScale;
    const iy = (mouseY - y) / preScale;
    const nx = ix * nextScale;
    const ny = iy * nextScale;
    const cx = ix + (mouseX - ix) - nx;
    const cy = iy + (mouseY - iy) - ny;

    this.setState({
      scale: nextScale,
      offset: { x: cx, y: cy },
    });
  };

  render() {
    const {
      scale,
      offset: { x, y },
    } = this.state;
    const cssvar = getCSSVar(x, y, scale);
    return (
      <div
        ref={this.ref}
        className={styles['infinite-wrapper']}
        onWheel={this.onWheeling}
        onMouseDown={this.onMouseDown}
        onClick={this.deactivate}
        style={cssvar}
      >
        <div ref={this.container} className="scroller">
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default InfiniteViewer;
