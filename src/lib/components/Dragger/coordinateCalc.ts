import { coordinates, MouseEventCollection } from '@app/types';
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
  domParent: Element | null = null;
  movecb: cb = noop;
  endcb: cb = noop;
  getScale = () => 1;
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

  iter(e: MouseEventCollection) {
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
    document.addEventListener('mousemove', this.move);
    document.addEventListener('mouseup', this.end);
  }
}

export default CoordinateCalc;
