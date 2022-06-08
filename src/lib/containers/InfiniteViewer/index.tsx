import React, { Component, createRef } from 'react';
import {
  coordinates,
  DraggerData,
  InfiniteViewerProps,
  InfiniteViewerState,
  SelectModeType,
  UpdaterType,
} from '@lib/types';
import { CoordinateCalc } from '@lib/components/Dragger';
import SelectArea from '@lib/components/SelectArea';
import { createMemo, preventDefault } from '@lib/utils';
import debounce from 'lodash.debounce';
import { ViewerProvider } from '@lib/contexts/viewer';
import styles from './index.module.scss';
import { captureTrue, commonDragOpt, getViewerContext } from './utils';

class InfiniteViewer extends Component<InfiniteViewerProps, InfiniteViewerState> {
  private observer: ResizeObserver | undefined;
  private dragger = new CoordinateCalc();
  private ref = createRef<HTMLDivElement>();
  private container = createRef<HTMLDivElement>();
  private offsetSnapshot: coordinates = { x: 0, y: 0 };
  // the global mouse up event also fires the click, flag it when mouse up
  private mouseDownTime = NaN;
  private onContainerResize;
  private memoContext = createMemo(getViewerContext);
  // private memoCSSVar: typeof getCSSVar;
  state: InfiniteViewerState = {
    scale: 1,
    offset: { x: 0, y: 0 },
    selectMode: SelectModeType.single,
    selecting: false,
    dragStart: { x: 0, y: 0 },
    dragEnd: { x: 0, y: 0 },
    viewerHeight: NaN,
    viewerWidth: NaN,
  };

  constructor(props: InfiniteViewerProps) {
    super(props);
    const onContainerResize = (entries: ResizeObserverEntry[]) => {
      const { width, height } = entries[0].contentRect;
      this.props.onContainerResize?.(width, height);
      this.setState({ viewerHeight: height, viewerWidth: width });
    };
    this.onContainerResize = debounce(onContainerResize, 200);
  }

  setScale = (scale: number) => {
    if (scale === this.state.scale) return;
    this.setState({ scale });
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
    const { viewerWidth, viewerHeight } = this.state;
    const offsetX = viewerWidth / 2 - scale * x;
    const offsetY = viewerHeight / 2 - scale * y;
    this.setOffset({ x: offsetX, y: offsetY });
  };

  componentDidMount() {
    this.observer = new ResizeObserver(this.onContainerResize);
    this.observer.observe(this.container.current!);
  }

  componentWillUnmount() {
    this.observer?.disconnect();
  }

  componentDidUpdate(lp: InfiniteViewerProps, ls: InfiniteViewerState) {
    if (ls.scale !== this.state.scale) {
      this.props.onViewerScale?.(this.state.scale);
    }
  }

  private isBlankClicked(event: UIEvent) {
    // console.log(event.target === this.ref.current);
    return (
      event.target === this.ref.current ||
      Array.from(this.container.current?.children ?? []).includes(event.target as any)
    );
  }

  private onWheeling = (e: React.WheelEvent) => {
    if (this.state.selectMode === 'single') {
      this.scaling(e);
    } else if (this.state.selectMode === 'select') {
      this.scrolling(e);
    }
  };

  private onMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    this.mouseDownTime = e.timeStamp;
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
    } else {
      this.props.onSelecting?.(dragStart, payload['dragEnd'], offset, scale);
    }
    this.setState(payload as any);
  };

  private onSelectEnd = (e: MouseEvent) => {
    if (e.button === 0) {
      if (this.state.selecting) {
        const { dragEnd, dragStart, offset, scale } = this.state;
        if (dragStart.x !== dragEnd.x && dragStart.y !== dragEnd.y) {
          this.props.onSelectEnd?.(dragStart, dragEnd, offset, scale);
        }
      } else {
        this.disFocus(e);
      }
    }

    this.setState({ selecting: false });
  };

  private onMoveStart(e: React.MouseEvent) {
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
    this.disFocus(e);
  };

  private disFocus = (e: MouseEvent) => {
    if (this.isBlankClicked(e) && Math.abs(e.timeStamp - this.mouseDownTime) < 100) {
      e.stopPropagation();
      this.props.onClick?.(e);
      this.props.onViewerClick?.(e, this.state.offset, this.state.scale);
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
    this.setOffset({ x: x + deltaX, y: y + deltaY });
  }

  private onDrop = (e: React.DragEvent) => {
    const { offset, scale } = this.state;
    this.props.onViewerDrop?.(e, offset, scale);
  };

  setOffset = (offsetUpdater: UpdaterType<coordinates>) => {
    this.setState((prev) => ({
      ...prev,
      offset: typeof offsetUpdater === 'function' ? offsetUpdater(prev.offset) : offsetUpdater,
    }));
  };

  render() {
    const { scale, offset, selecting, dragEnd, dragStart, viewerHeight, viewerWidth } = this.state;
    const { x, y } = offset;
    // const cssvar = this.memoCSSVar(offset, scale);
    const contextVal = this.memoContext(offset, scale, viewerHeight, viewerWidth, this.setOffset);
    return (
      <div
        ref={this.ref}
        className={styles['infinite-wrapper']}
        onWheel={this.onWheeling}
        onMouseDown={this.onMouseDown}
        onDrop={this.onDrop}
        onDragOver={preventDefault}
      >
        <ViewerProvider value={contextVal}>
          <div
            ref={this.container}
            className="scroller"
            style={{ transform: `translate(${x}px,${y}px) scale(${scale})` }}
          >
            {this.props.children}
          </div>
          {this.props.outerChildren}
        </ViewerProvider>
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
