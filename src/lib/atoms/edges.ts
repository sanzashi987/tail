import { Edge, EdgeAtom, EdgeInProgressAtomType, SelectorInput } from '@app/types';
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
  get:
    (input: any) =>
    ({ get }) => {
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
      const {
        handles: { source: sourceHandles },
        node: { left: sourceLeft, top: sourceTop },
      } = get(sourceAtom);
      const {
        handles: { target: targetHandles },
        node: { left: targetLeft, top: targetTop },
      } = get(targetAtom);

      const { x: sourceX, y: sourceY } = sourceHandles[source] ?? emptyHandle;
      const { x: targetX, y: targetY } = targetHandles[target] ?? emptyHandle;

      return {
        ...edgeState,
        sourceX: sourceX + sourceLeft,
        sourceY: sourceY + sourceTop,
        targetX: targetX + targetLeft,
        targetY: targetY + targetTop,
      };
    },
});

export const edgeInProgressAtom = atom<EdgeInProgressAtomType>({
  key: 'tailEdgeInProgress',
  default: {
    active: false,
    source: '',
    sourceNode: '',
    ...emptySourceTarget,
  },
});
