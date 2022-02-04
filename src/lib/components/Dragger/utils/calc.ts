import type { MouseEvent as ReactMouseEvent } from 'react';
import type { coordinates, DraggerIterState } from '@types';
// import type ReactDragger from '../react-dragger/react-dragger';

export const getCoordinatesFromParent = (
  e: MouseEvent | ReactMouseEvent,
  parent: Element,
  scale: number,
) => {
  const { left, top } = parent.getBoundingClientRect();
  const x = (e.clientX + parent.scrollLeft - left) / scale;
  const y = (e.clientY + parent.scrollTop - top) / scale;
  // console.log(e.clientX, e.clientY, left, top)
  return { x, y };
};

export const getDraggerRelativeCoordinates = (state: DraggerIterState, coordinate: coordinates) => {
  let { x, y, lastX, lastY } = state;
  const [deltaX, deltaY] = [coordinate.x - lastX, coordinate.y - lastY];
  [lastX, lastY] = [coordinate.x, coordinate.y];
  [x, y] = [x + deltaX, y + deltaY];
  return {
    lastX,
    lastY,
    x,
    y,
  };
};

export function getDraggerStyle(x: number, y: number) {
  return {
    transform: `translate(${x}px,${y}px)`,
  };
}
