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
  return { x, y };
};

export const getDraggerRelativeCoordinates = (
  x: number,
  y: number,
  lastX: number,
  lastY: number,
  coordinate: coordinates,
) => {
  // let { x, y, lastX, lastY } = state;
  // console.log(x, y, lastX, lastY);
  const [deltaX, deltaY] = [coordinate.x - lastX, coordinate.y - lastY];
  const [lastXNext, lastYNext] = [coordinate.x, coordinate.y];
  return {
    lastX: lastXNext,
    lastY: lastYNext,
    x: x + deltaX,
    y: y + deltaY,
  };
};

export function getDraggerStyle(x: number, y: number) {
  return {
    transform: `translate(${x}px,${y}px)`,
  };
}
