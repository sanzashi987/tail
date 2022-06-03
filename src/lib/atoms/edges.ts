import { Edge, EdgeAtom, EdgeInProgressAtomType, SelectorInput } from '@lib/types';
import { atomWithImmer } from 'jotai/immer';

export function createEdgeAtom(edge: Edge) {
  return atomWithImmer<EdgeAtom>({
    edge,
    selected: false,
    hovered: false,
    reconnect: false,
    forceRender: 0,
  });
}

const emptySourceTarget = {
  sourceX: NaN,
  sourceY: NaN,
  targetX: NaN,
  targetY: NaN,
};

export const edgeInProgressAtom = atomWithImmer<EdgeInProgressAtomType>({
  active: false,
  reconnect: false,
  to: 'target',
  nodeId: '',
  handleId: '',
  ...emptySourceTarget,
});
