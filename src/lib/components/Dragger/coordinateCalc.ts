import { MouseEventCollection } from '@app/types';
import { getCoordinatesFromParent, getDraggerRelativeCoordinates } from './utils/calc';

const defaultState = {
  x: NaN,
  y: NaN,
  lastX: NaN,
  lastY: NaN,
};

class CoordinateCalc {
  private state = defaultState;

  start = (e: MouseEventCollection, x: number, y: number, parent: Element, scale: number) => {
    const cor = getCoordinatesFromParent(e, parent, scale);
    this.state = { x, y, lastX: cor.x, lastY: cor.y };
  };

  iter = (e: MouseEventCollection, parent: Element, scale: number) => {
    const cor = getCoordinatesFromParent(e, parent, scale);
    const { x, y, lastY, lastX } = this.state;
    this.state = getDraggerRelativeCoordinates(x, y, lastX, lastY, cor);
    return this.state;
  };

  end = (e: MouseEventCollection, parent: Element, scale: number) => {
    const a = this.iter(e, parent, scale);
    this.state = defaultState;
    return a;
  };
}

export default CoordinateCalc;
