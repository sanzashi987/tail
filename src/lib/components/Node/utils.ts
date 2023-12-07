import React, { useContext, useEffect } from 'react';
import type {
  Node,
  HandleMap,
  HandlesInfo,
  Rect,
  JotaiSetStateAction,
  NodeAtomState,
} from '@lib/types';
import { defaultRect, ZeroPositionNodeAtom } from '@lib/atoms/nodes';
import { ParserContext } from '@lib/contexts';
import { useAtomValue } from 'jotai';

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

    /**Local coordinate, won't change unless the handle layout is updated */
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

export const useNodePosition = (
  nodeState: NodeAtomState,
  setNodeInternal: JotaiSetStateAction<NodeAtomState>,
) => {
  const { node, runtimePosition } = nodeState;
  const { nodeUpdater } = useContext(ParserContext)!;
  const { runtimePosition: parentPosition } = useAtomValue(
    nodeUpdater.getAtoms()[node.parent ?? ''] ?? ZeroPositionNodeAtom,
  );

  const { left, top } = node;

  useEffect(() => {
    const runtimeX = left + parentPosition.x;
    const runtimeY = top + parentPosition.y;
    if (runtimeX !== runtimePosition.x || runtimeY !== runtimePosition.y) {
      setNodeInternal((last) => {
        last.runtimePosition = { x: runtimeX, y: runtimeY };
      });
    }
  }, [left, top, runtimePosition, parentPosition]);

  return {
    x: left,
    y: top,
    absX: runtimePosition.x,
    absY: runtimePosition.y,
  };
};
