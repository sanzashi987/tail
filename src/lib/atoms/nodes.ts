import { JotaiImmerAtom } from '@lib/types/jotai';
import { atomWithImmer } from 'jotai-immer';
import type { Node, NodeAtomState } from '@lib/types';

export const defaultRect = {
  x: NaN,
  y: NaN,
  width: NaN,
  height: NaN,
};

const createDefaultNodeDescriber = (
  overrides: Partial<Omit<NodeAtomState, 'node'>> = {},
): Omit<NodeAtomState, 'node'> => ({
  hovered: false,
  selected: false,
  // selectedHandles: {},
  handles: {
    source: {},
    target: {},
  },
  rect: defaultRect,
  forceRender: 0,
  runtimePosition: { x: NaN, y: NaN },
  ...overrides,
});

export function createNodeAtom<T extends Record<string, any>>(
  node: Node<T>,
  describerOverride: Partial<ReturnType<typeof createDefaultNodeDescriber>> = {},
) {
  return atomWithImmer<NodeAtomState<T>>({
    node,
    ...createDefaultNodeDescriber({ runtimePosition: { x: node.left, y: node.top } }),
    ...describerOverride,
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

export const ZeroPositionNodeAtom: JotaiImmerAtom<NodeAtomState> = atomWithImmer({
  node: {
    id: 'zero-offset',
    left: NaN,
    top: NaN,
    type: '',
  },
  ...createDefaultNodeDescriber({ runtimePosition: { x: 0, y: 0 } }),
});
