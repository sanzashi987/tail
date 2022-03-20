import { useEffect, useRef, useState } from 'react';
import { Box, Rect } from '@app/types';

export function binarySearch(sortedArr: number[], val: number) {
  let minIndex = 0,
    maxIndex = sortedArr.length;

  while (minIndex < maxIndex) {
    const mid = (minIndex + maxIndex) >>> 1; // right shift avoid decimal
    if (sortedArr[minIndex] < val) minIndex = mid + 1;
    else maxIndex = mid;
  }
  return minIndex;
}

// mutatably
export function binaryInsert(sortedArr: number[], val: number) {
  const index = binarySearch(sortedArr, val);
  sortedArr.splice(index, 0, val);
}

export function binaryDelete(sortedArr: number[], val: number) {
  const index = binarySearch(sortedArr, val);
  sortedArr.splice(index, 1);
}

export function binaryUpdate(sortedArr: number[], val: number, lastVal?: number) {
  if (lastVal) {
    binaryDelete(sortedArr, lastVal);
  }
  binaryInsert(sortedArr, val);
}

export function toBox(rect: Rect): Box {
  const { x, y, width, height } = rect;
  return {
    x,
    y,
    x2: x + width,
    y2: y + height,
  };
}

export function getLargeBox(box1: Box, box2: Box): Box {
  return {
    x: Math.min(box1.x, box2.x),
    y: Math.min(box1.y, box2.y),
    x2: Math.max(box1.x2, box2.x2),
    y2: Math.max(box1.y2, box2.y2),
  };
}

export function toRect(box: Box): Rect {
  const { x, y, x2, y2 } = box;
  return {
    x,
    y,
    width: x2 - x,
    height: y2 - y,
  };
}
