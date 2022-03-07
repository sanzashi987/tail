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

  scaling = (r: React.WheelEvent) => {
    const e = r.nativeEvent;
    const { deltaY, offsetX, offsetY } = e;
    const {
      offset: { x, y },
      scale: preScale,
    } = this.state;

    const absX = offsetX / preScale + x;
    const absY = offsetY / preScale + y;

    // const [absX, absY] = [offsetX + x, offsetY + y];

    const newScale = preScale + (8 * deltaY > 0 ? 1 : -1) / 100;
    const k = newScale / preScale;

    const [newAbsX, newAbsY] = [absX * k, absY * k];

    const [dx, dy] = [newAbsX - absX, newAbsY - absY];
    this.setState({
      scale: newScale,
      offset: { x: x + dx, y: y + dy },
    });
  };

  render() {
    const {
      scale,
      offset: { x, y },
    } = this.state;
    return (
      <div ref={this.ref} className={styles['infinite-wrapper']} onWheel={this.scaling}>
        <div
          className="fake-layer"
          style={{
            transform: `translate(${x}px,${y}px)  scale(${scale})`,
          }}
        >
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default InfiniteViewer;
