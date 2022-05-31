import type { Node, NodeAtom } from '@app/types';
import { atom } from 'recoil';

export const defaultRect = {
  x: NaN,
  y: NaN,
  width: NaN,
  height: NaN,
};

export function createNodeAtom<T>(node: Node<T>) {
  return atom<NodeAtom<T>>({
    key: `${node.id}__node-${Date.now().toString(36)}`,
    default: {
      node,
      hovered: false,
      selected: false,
      selectedHandles: {},
      handles: {
        source: {},
        target: {},
      },
      rect: defaultRect,
      forceRender: 0,
    },
  });
}
