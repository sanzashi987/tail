import { JotaiImmerAtom } from '@lib/types/jotai';
import { atomWithImmer } from 'jotai/immer';
import type { Node, NodeAtom } from '@lib/types';

export const defaultRect = {
  x: NaN,
  y: NaN,
  width: NaN,
  height: NaN,
};

const createDefaultNodeDescriber = () => ({
  hovered: false,
  selected: false,
  selectedHandles: {},
  handles: {
    source: {},
    target: {},
  },
  rect: defaultRect,
  forceRender: 0,
});

export function createNodeAtom<T>(node: Node<T>) {
  return atomWithImmer<NodeAtom<T>>({
    node,
    ...createDefaultNodeDescriber(),
  });
}

export const DummyNodeAtom: JotaiImmerAtom<NodeAtom> = atomWithImmer({
  node: {
    id: 'dummy',
    left: NaN,
    top: NaN,
    type: '',
  },
  ...createDefaultNodeDescriber(),
});
