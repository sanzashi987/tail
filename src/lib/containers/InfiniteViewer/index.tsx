import React, { Component, createRef } from 'react';
import {
  coordinates,
  DraggerData,
  InfiniteViewerProps,
  InfiniteViewerState,
  SelectModeType,
} from '@types';
import ResizeObserver from 'resize-observer-polyfill';
import { CoordinateCalc } from '@app/components/Dragger';
import SelectArea from '@app/components/SelectArea';
import styles from './index.module.scss';
import { getCSSVar, captureTrue, commonDragOpt, defaultRect } from './utils';

class InfiniteViewer extends Component<InfiniteViewerProps, InfiniteViewerState> {
  private observer: ResizeObserver | undefined;
  private dragger = new CoordinateCalc();
  private ref = createRef<HTMLDivElement>();
  private container = createRef<HTMLDivElement>();
  private containerRect = defaultRect;
  private offsetSnapshot: coordinates = { x: 0, y: 0 };
  // the global mouse up event also fires the click, flag it when mouse up
  private blockClick = false;

  state: InfiniteViewerState = {
    scale: 1,
    offset: { x: 0, y: 0 },
    selectMode: /*  'select', // */ 'single',
    selecting: false,
    dragStart: { x: 0, y: 0 },
    dragEnd: { x: 0, y: 0 },
    duration: 0,
  };

  getScale = () => {
    return this.state.scale;
  };

  switchMode = (mode: SelectModeType) => {
    if (mode === this.state.selectMode) return;
    this.setState({ selectMode: mode });
  };

  moveCamera = (x: number, y: number) => {
    const { scale } = this.state;
    let { width, height } = this.containerRect;
    (width /= 2), (height /= 2);
    const offsetX = width - scale * x;
    const offsetY = height - scale * y;
    this.setState({ offset: { x: offsetX, y: offsetY }, duration: 0.5 }, async () => {
      await new Promise((res) =>
        setTimeout(() => {
          res(null);
        }, 500),
      );
      this.setState({ duration: 0 });
    });
  };

  componentDidMount() {
    this.observer = new ResizeObserver(this.onContainerResize);
    this.observer.observe(this.container.current!);
  }

  componentWillUnmount() {
    this.observer?.disconnect();
  }

  private isSelfEvent(event: React.UIEvent) {
    return Array.from(this.container.current?.children ?? []).includes(event.target as any);
  }

  private onWheeling = (e: React.WheelEvent) => {
    if (this.state.selectMode === 'single') {
      this.scaling(e);
    } else if (this.state.selectMode === 'select') {
      this.scrolling(e);
    }
  };

  private onContainerResize = (entries: ResizeObserverEntry[]) => {
    const rect = entries[0].contentRect;
    this.containerRect = rect;
    this.props.onContainerResize?.(rect.width, rect.height);
  };

  private onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    if (this.state.selectMode === 'single') {
      this.onMoveStart(e);
    } else if (this.state.selectMode === 'select') {
      this.onSelectStart(e);
    }
  };

  private onSelectStart(e: React.MouseEvent) {
    this.dragger.start(e, {
      ...commonDragOpt,
      movecb: this.onSelecting,
      endcb: this.onSelectEnd,
      moveOpt: captureTrue,
    });
  }

  private onSelecting = ({ clientX, clientY }: MouseEvent) => {
    const payload: Partial<InfiniteViewerState> = {};
    const { offset, selecting, dragStart, scale } = this.state;
    const { x, y } = this.ref.current!.getBoundingClientRect();
    payload['dragEnd'] = { x: clientX - x, y: clientY - y };
    if (selecting === false) {
      payload['dragStart'] = payload['dragEnd'];
      this.offsetSnapshot = offset;
      payload['selecting'] = true;
      this.blockClick = true;
    } else {
      this.props.onSelecting?.(dragStart, payload['dragEnd'], offset, scale);
    }
    this.setState(payload as any);
  };

  private onSelectEnd = (e: MouseEvent) => {
    if (this.state.selecting && e.button === 0) {
      const { dragEnd, dragStart, offset, scale } = this.state;
      if (dragStart.x !== dragEnd.x && dragStart.y !== dragEnd.y) {
        this.props.onSelectEnd?.(dragStart, dragEnd, offset, scale);
      }
      this.setState({ selecting: false });
    }
  };

  private onMoveStart(e: React.MouseEvent) {
    e.stopPropagation();
    this.dragger.start(e, {
      ...commonDragOpt,
      movecb: this.onMove,
      endcb: this.onMoveEnd,
      moveOpt: {},
    });
  }

  private onMove = (e: MouseEvent, { deltaX, deltaY }: DraggerData) => {
    this.setState((prev) => ({
      ...prev,
      offset: {
        x: prev.offset.x + deltaX,
        y: prev.offset.y + deltaY,
      },
    }));
  };

  private onMoveEnd = (e: MouseEvent) => {
    e.stopPropagation();
  };

  private onClick = (e: React.MouseEvent) => {
    if (this.blockClick) {
      this.blockClick = false;
      return;
    }
    if (this.isSelfEvent(e)) {
      e.stopPropagation();
      this.props.onClick?.(e);
    }
  };

  private scaling({ deltaY, clientY, clientX }: React.WheelEvent) {
    const rec = this.ref.current?.getBoundingClientRect() ?? { x: 0, y: 0 };
    const [mouseX, mouseY] = [clientX - rec.x, clientY - rec.y];
    const {
      offset: { x, y },
      scale: preScale,
    } = this.state;
    const nextScale = preScale + (deltaY > 0 ? 1 : -1) * 0.08;
    if (nextScale < 0.2 || nextScale > 4) return;
    const cx = mouseX - ((mouseX - x) / preScale) * nextScale;
    const cy = mouseY - ((mouseY - y) / preScale) * nextScale;
    this.setState({
      scale: nextScale,
      offset: { x: cx, y: cy },
    });
  }

  private scrolling(e: React.WheelEvent) {
    let { deltaX, deltaY } = e;
    if (e.buttons === 4) return;
    const { x, y } = this.state.offset;
    if (e.shiftKey && !deltaX) {
      deltaX = deltaY;
      deltaY = 0;
    }
    this.setState({ offset: { x: x + deltaX, y: y + deltaY } });
  }

  private onDrop = (e: React.DragEvent) => {
    const { offset, scale } = this.state;
    this.props.onViewerDrop?.(e, offset, scale);
  };

  render() {
    const { scale, offset, selecting, dragEnd, dragStart, duration } = this.state;
    const cssvar = getCSSVar(offset, scale, duration);
    return (
      <div
        ref={this.ref}
        className={styles['infinite-wrapper']}
        onWheel={this.onWheeling}
        onMouseDown={this.onMouseDown}
        onClick={this.onClick}
        onDrop={this.onDrop}
        style={cssvar}
      >
        <div ref={this.container} className="scroller">
          {this.props.children}
        </div>
        {selecting && (
          <SelectArea
            dragEnd={dragEnd}
            dragStart={dragStart}
            offsetSnap={this.offsetSnapshot}
            offset={offset}
          />
        )}
      </div>
    );
  }
}

export default InfiniteViewer;
