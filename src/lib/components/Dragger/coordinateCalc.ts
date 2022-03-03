import type { MouseEventCollection } from '@app/types';
import { getCoordinatesFromParent, getDraggerRelativeCoordinates } from './utils/calc';

const defaultState = {
  x: NaN,
  y: NaN,
  lastX: NaN,
  lastY: NaN,
};

const noop = () => defaultState;

type cb = (x: number, y: number) => void;
type StartPayload = {
  x: number;
  y: number;
  parent: Element;
  movecb: cb;
  endcb: cb;
  getScale(): number;
};
class CoordinateCalc {
  private state = defaultState;
  private domParent: Element | null = null;
  private movecb: cb = noop;
  private endcb: cb = noop;
  private getScale = () => 1;
  start = (e: MouseEventCollection, { x, y, parent, movecb, endcb, getScale }: StartPayload) => {
    e.stopPropagation();
    const cor = getCoordinatesFromParent(e, parent, getScale());
    this.domParent = parent;
    this.movecb = movecb;
    this.endcb = endcb;
    this.getScale = getScale;
    this.state = { x, y, lastX: cor.x, lastY: cor.y };
    document.addEventListener('mousemove', this.move);
    document.addEventListener('mouseup', this.end);
  };

  move = (e: MouseEventCollection) => {
    this.iter(e);
    this.movecb(this.state.x, this.state.y);
  };

  private iter(e: MouseEventCollection) {
    e.stopPropagation();
    const cor = getCoordinatesFromParent(e, this.domParent!, this.getScale());
    const { x, y, lastY, lastX } = this.state;
    this.state = getDraggerRelativeCoordinates(x, y, lastX, lastY, cor);
  }

  end = (e: MouseEventCollection) => {
    this.iter(e);
    this.endcb(this.state.x, this.state.y);
    this.reset();
  };

  reset() {
    this.domParent = null;
    this.state = defaultState;
    this.movecb = this.endcb = noop;
    document.removeEventListener('mousemove', this.move);
    document.removeEventListener('mouseup', this.end);
  }
}

export default CoordinateCalc;
