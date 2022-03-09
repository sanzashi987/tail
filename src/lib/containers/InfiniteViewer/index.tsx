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
import { getCSSVar, captureTrue, commonDragOpt } from './utils';

class InfiniteViewer extends Component<InfiniteViewerProps, InfiniteViewerState> {
  private observer: ResizeObserver | undefined;
  private dragger = new CoordinateCalc();
  private ref = createRef<HTMLDivElement>();
  private container = createRef<HTMLDivElement>();

  state: InfiniteViewerState = {
    scale: 1,
    offset: { x: 0, y: 0 },
    selectMode: 'select', //'single',
    selecting: false,
    dragStart: { x: 0, y: 0 },
    dragEnd: { x: 0, y: 0 },
  };

  getScale = () => {
    return this.state.scale;
  };

  switchMode = (mode: SelectModeType) => {
    if (mode === this.state.selectMode) return;
    this.setState({ selectMode: mode });
  };

  componentDidMount() {
    this.observer = new ResizeObserver(this.onDomResize);
    this.observer.observe(this.ref.current!);
  }

  componentWillUnmount() {
    this.observer?.disconnect();
  }

  private onWheeling = (e: React.WheelEvent) => {
    if (this.state.selectMode === 'single') {
      this.scaling(e);
    } else if (this.state.selectMode === 'select') {
      this.scrolling(e);
    }
  };

  private onDomResize = () => {
    return;
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

  private offsetSnapshot: coordinates = { x: 0, y: 0 };
  private onSelecting = ({ clientX, clientY }: MouseEvent) => {
    const payload: Partial<InfiniteViewerState> = {};
    const { offset, selecting, dragStart, scale } = this.state;
    const { x, y } = this.ref.current!.getBoundingClientRect();
    payload['dragEnd'] = { x: clientX - x, y: clientY - y };
    if (selecting === false) {
      payload['dragStart'] = payload['dragEnd'];
      this.offsetSnapshot = offset;
      payload['selecting'] = true;
    } else {
      this.props.onSelecting?.(dragStart, payload['dragEnd'], offset, scale);
    }
    this.setState(payload as any);
  };

  private onSelectEnd = (e: MouseEvent) => {
    if (this.state.selecting && e.button === 0) {
      const { dragEnd, dragStart, offset, scale } = this.state;
      if (dragStart.x !== dragEnd.x && dragStart.y !== dragEnd.y) {
        this.props.onSelecting?.(dragStart, dragEnd, offset, scale);
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
    if (Array.from(this.container.current?.children ?? []).includes(e.target as any)) {
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

  render() {
    const { scale, offset, selecting, dragEnd, dragStart } = this.state;
    const cssvar = getCSSVar(offset, scale);
    return (
      <div
        ref={this.ref}
        className={styles['infinite-wrapper']}
        onWheel={this.onWheeling}
        onMouseDown={this.onMouseDown}
        onClick={this.onClick}
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
