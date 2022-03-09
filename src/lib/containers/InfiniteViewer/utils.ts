import { coordinates } from '@app/types';

export function getCSSVar({ x, y }: coordinates, scale: number) {
  const bg = 96 * scale,
    bgs = 24 * scale,
    posX = (1 + x) % 96,
    posY = (1 + y) % 96;
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

// export function findInsideNodes() {}
