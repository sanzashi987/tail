import { Box, Rect } from '@app/types';

export function binarySearch(sortedArr: number[], val: number) {
  let minIndex = 0,
    maxIndex = sortedArr.length;

  while (minIndex < maxIndex) {
    const mid = (minIndex + maxIndex) >>> 1; // right shift avoid decimal
    if (sortedArr[mid] < val) minIndex = mid + 1;
    else maxIndex = mid;
  }
  return minIndex;
}

// mutatably
function binaryInsert(sortedArr: number[], val: number) {
  const index = binarySearch(sortedArr, val);
  sortedArr.splice(index, 0, val);
}

function binaryDelete(sortedArr: number[], val: number) {
  const index = binarySearch(sortedArr, val);
  sortedArr.splice(index, 1);
}

function binaryUpdate(sortedArr: number[], val: number, lastVal?: number) {
  if (lastVal) {
    binaryDelete(sortedArr, lastVal);
  }
  binaryInsert(sortedArr, val);
}

export function binaryUpdateBox(sortedX: number[], sortedY: number[], box: Box, lastBox?: Box) {
  binaryUpdate(sortedX, box.x, lastBox?.x);
  binaryUpdate(sortedX, box.x2, lastBox?.x2);
  binaryUpdate(sortedY, box.y, lastBox?.y);
  binaryUpdate(sortedY, box.y2, lastBox?.y2);
}

export function binaryRemoveBox(sortedX: number[], sortedY: number[], box: Box) {
  binaryDelete(sortedX, box.x);
  binaryDelete(sortedX, box.x2);
  binaryDelete(sortedY, box.y);
  binaryDelete(sortedY, box.y2);
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
