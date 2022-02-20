import { Edge, EdgeAtom, EdgeInPrgressAtom, SelectorInput } from '@app/types';
import { atom, selectorFamily } from 'recoil';

export function createEdgeAtom(edge: Edge) {
  return atom<EdgeAtom>({
    key: `${edge.id}__edge`,
    default: {
      edge,
      selected: false,
      reconnect: false,
      forceRender: 0,
    },
  });
}

const emptySourceTarget = {
  sourceX: NaN,
  sourceY: NaN,
  targetX: NaN,
  targetY: NaN,
};
const emptyHandle = {
  x: NaN,
  y: NaN,
};

export const computedEdgeSelector = selectorFamily({
  key: 'edgeWrapperSelector',
  get: (input: any) => ({ get }) => {
    const { edge, nodeAtoms } = input as SelectorInput;
    const edgeState = get(edge);
    const {
      edge: { sourceNode, targetNode, source, target },
    } = edgeState;
    const sourceAtom = nodeAtoms[sourceNode],
      targetAtom = nodeAtoms[targetNode];
    if (!sourceAtom || !targetAtom) {
      return {
        ...edgeState,
        ...emptySourceTarget,
      };
    }
    const { x: sourceX, y: sourceY } = get(sourceAtom).handles.source[source] ?? emptyHandle;
    const { x: targetX, y: targetY } = get(targetAtom).handles.target[target] ?? emptyHandle;

    return {
      ...edgeState,
      sourceX,
      sourceY,
      targetX,
      targetY,
    };
  },
  // set: () => () => {

  // }
});

export const EdgeInProgressAtom = atom<EdgeInPrgressAtom>({
  key: 'tailEdgeInProgress',
  default: {
    active: false,
    source: '',
    sourceNode: '',
    ...emptySourceTarget,
  },
});

