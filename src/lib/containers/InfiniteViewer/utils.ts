// import { defaultVal } from '@app/contexts/viewer';
import { coordinates, UpdaterType } from '@app/types';

export function getCSSVar({ x, y }: coordinates, scale: number) {
  const bg = 96 * scale,
    bgs = 24 * scale,
    posX = x,
    posY = y;
  const cssvar: any = {
    '--x': `${x}px`,
    '--y': `${y}px`,
    '--scale': scale,
    '--bgsize': `${bg}px ${bg}px, ${bg}px ${bg}px, ${bgs}px ${bgs}px, ${bgs}px ${bgs}px`,
    '--bgpos': `${posX}px ${posY}px, ${posX}px ${posY}px, ${posX}px ${posY}px, ${posX}px ${posY}px`,
  };
  return cssvar;
}

export function scaleOne() {
  return 1;
}

export const captureTrue = {
  capture: true,
};

export const commonDragOpt = {
  x: 0,
  y: 0,
  parent: document.body,
  getScale: scaleOne,
  endOpt: captureTrue,
};

export const defaultRect: DOMRectReadOnly = {
  x: NaN,
  y: NaN,
  width: NaN,
  height: NaN,
  top: NaN,
  bottom: NaN,
  left: NaN,
  right: NaN,
  toJSON: () => NaN,
};
// export function findInsideNodes() {}

export function getViewerContext(
  offset: coordinates,
  scale: number,
  viewerHeight: number,
  viewerWidth: number,
  setOffset: (c: UpdaterType<coordinates>) => void,
) {
  return { offset, scale, viewerHeight, viewerWidth, setOffset };
}
