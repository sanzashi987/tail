import React, { Component, createRef } from 'react';
import type { InfiniteViewerProps, InfiniteViewerState } from '@types';
import ResizeObserver from 'resize-observer-polyfill';
import styles from './index.module.scss';

class InfiniteViewer extends Component<InfiniteViewerProps, InfiniteViewerState> {
  public observer: ResizeObserver | undefined;
  ref = createRef<HTMLDivElement>();

  state: InfiniteViewerState = {
    scale: 1,
    offset: { x: 0, y: 0 },
    selectMode: 'single',
  };

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

  // onWheeling = () => {};

  onDomResize = () => {
    return;
  };

  scaling = (e: React.WheelEvent) => {
    const { deltaY, clientY, clientX } = e;
    const rec = this.ref.current!.getBoundingClientRect();
    const [mouseX, mouseY] = [clientX - rec?.x, clientY - rec?.y];
    const {
      offset: { x, y },
      scale: preScale,
    } = this.state;
    const nextScale = preScale + (deltaY > 0 ? 1 : -1) * 0.08;
    if (nextScale < 0.2) return;
    // const [projectX, projectY] = [mouseX / preScale, mouseY / preScale];
    // const k = 1 - nextScale / preScale;
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
    return (
      <div ref={this.ref} className={styles['infinite-wrapper']} onWheel={this.scaling}>
        <div className="scroller" style={{ transform: `translate(${x}px,${y}px) scale(${scale})` }}>
          <div className="scaler" style={{ transform: `scale(${scale})` }}>
            {this.props.children}
          </div>
        </div>
      </div>
    );
  }
}

export default InfiniteViewer;
