import type { Node, HandleElement, HandleMap, HandlesInfo } from '@types'
import React from 'react';

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
  k: number
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
      x: (bounds.left - parentBounds.left) / k,
      y: (bounds.top - parentBounds.top) / k,
      ...dimensions,
    };
    return lastRes
  }, {});
};

const EmptyHandles = { source: {}, target: {} }

export const getHandlesPosition = (
  ref: React.RefObject<HTMLDivElement | undefined>,
  node: Node
): HandlesInfo => {
  if (!ref.current) {
    console.warn('fail to retrieve the DOM instance of', node);
    return EmptyHandles
  }
  return getHandleBounds(ref.current, 1)

}