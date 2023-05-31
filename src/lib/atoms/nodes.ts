import { JotaiImmerAtom } from '@lib/types/jotai';
import { atomWithImmer } from 'jotai/immer';
import type { Node, NodeAtomState } from '@lib/types';

export const defaultRect = {
  x: NaN,
  y: NaN,
  width: NaN,
  height: NaN,
};

const createDefaultNodeDescriber = () => ({
  hovered: false,
  selected: false,
  // selectedHandles: {},
  handles: {
    source: {},
    target: {},
  },
  rect: defaultRect,
  forceRender: 0,
});

export function createNodeAtom<T extends Record<string, any>>(node: Node<T>) {
  return atomWithImmer<NodeAtomState<T>>({
    node,
    ...createDefaultNodeDescriber(),
  });
}

export const DummyNodeAtom: JotaiImmerAtom<NodeAtomState> = atomWithImmer({
  node: {
    id: 'dummy',
    left: NaN,
    top: NaN,
    type: '',
  },
  ...createDefaultNodeDescriber(),
});
