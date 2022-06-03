import React from 'react';
import type { Node, HandleElement, HandleMap, HandlesInfo, Rect } from '@lib/types';
import { defaultRect } from '@lib/atoms/nodes';

export const getHandleBounds = (nodeElement: HTMLDivElement, scale: number) => {
  const bounds = nodeElement.getBoundingClientRect();

  return {
    source: getHandleBoundsByHandleType('.source', nodeElement, bounds, scale),
    target: getHandleBoundsByHandleType('.target', nodeElement, bounds, scale),
  };
};

export const getHandleBoundsByHandleType = (
  selector: string,
  nodeElement: HTMLDivElement,
  parentBounds: DOMRect,
  k: number,
): HandleMap => {
  const handles = nodeElement.querySelectorAll(selector);

  if (!handles || !handles.length) {
    return {};
  }

  const handlesArray = Array.from(handles) as HTMLDivElement[];

  return handlesArray.reduce<HandleMap>((lastRes, handle) => {
    const bounds = handle.getBoundingClientRect();
    const dimensions = { width: handle.offsetWidth, height: handle.offsetHeight };
    const handleId = handle.getAttribute('data-handle-id');
    // const handlePosition = handle.getAttribute('data-handlepos') as unknown as Position;

    // return {
    //   id: handleId!,
    //   // position: handlePosition,
    //   x: (bounds.left - parentBounds.left) / k,
    //   y: (bounds.top - parentBounds.top) / k,
    //   ...dimensions,
    // };
    lastRes[handleId!] = {
      id: handleId!,
      // position: handlePosition,
      x: (bounds.left - parentBounds.left + bounds.width / 2) / k,
      y: (bounds.top - parentBounds.top + bounds.height / 2) / k,
      ...dimensions,
    };
    return lastRes;
  }, {});
};

const EmptyHandles = { source: {}, target: {} };

export const getNodeInfo = (
  ref: React.RefObject<HTMLDivElement | undefined>,
  node: Node,
  scale: number,
): [Rect, HandlesInfo] => {
  if (!ref.current) {
    console.warn('fail to retrieve the DOM instance of', node);
    return [defaultRect, EmptyHandles];
  }
  const rect = ref.current.getBoundingClientRect();
  [rect.height, rect.width] = [Math.round(rect.height / scale), Math.round(rect.width / scale)];
  return [rect, getHandleBounds(ref.current, scale)];
};
