import type { DraggerData, MouseEventCollection } from '@app/types';
import { getCoordinatesFromParent, getDraggerRelativeCoordinates } from './utils/calc';

const defaultState = {
  x: NaN,
  y: NaN,
  lastX: NaN,
  lastY: NaN,
  deltaX: NaN,
  deltaY: NaN,
};

const noop = () => defaultState;

type cb = (e: MouseEvent, d: DraggerData) => void;
type StartPayload = {
  x?: number;
  y?: number;
  parent?: Element;
  movecb: cb;
  endcb: cb;
  getScale?: () => number;
  moveOpt?: AddEventListenerOptions;
  endOpt?: AddEventListenerOptions;
};
class CoordinateCalc {
  private state = defaultState;
  private domParent: Element | null = null;
  private movecb: cb = noop;
  private endcb: cb = noop;
  private getScale = () => 1;
  private moveOpt: AddEventListenerOptions | null = null;
  private endOpt: AddEventListenerOptions | null = null;

  start = (
    e: MouseEventCollection,
    {
      x = 0,
      y = 0,
      parent = document.body,
      movecb,
      endcb,
      getScale = () => 1,
      endOpt,
      moveOpt,
    }: StartPayload,
  ) => {
    e.stopPropagation();
    const cor = getCoordinatesFromParent(e, parent, getScale());
    this.domParent = parent;
    this.movecb = movecb;
    this.endcb = endcb;
    this.getScale = getScale;
    this.moveOpt = moveOpt ?? {};
    this.endOpt = endOpt ?? {};
    this.state = { x, y, lastX: cor.x, lastY: cor.y, deltaX: 0, deltaY: 0 };
    document.addEventListener('mousemove', this.move, this.moveOpt);
    document.addEventListener('mouseup', this.end, this.endOpt);
  };

  move = (e: MouseEvent) => {
    this.iter(e);
    this.movecb(e, this.state);
  };

  private iter(e: MouseEvent) {
    e.stopPropagation();
    const cor = getCoordinatesFromParent(e, this.domParent!, this.getScale());
    const { x, y, lastY, lastX } = this.state;
    this.state = getDraggerRelativeCoordinates(x, y, lastX, lastY, cor);
  }

  end = (e: MouseEvent) => {
    e.stopPropagation();
    e.stopImmediatePropagation();
    this.iter(e);
    this.endcb(e, this.state);
    this.reset();
  };

  reset() {
    this.domParent = null;
    this.state = defaultState;
    this.movecb = this.endcb = noop;
    document.removeEventListener('mousemove', this.move, this.moveOpt!);
    document.removeEventListener('mouseup', this.end, this.endOpt!);
    this.moveOpt = null;
    this.endOpt = null;
  }
}

export default CoordinateCalc;
