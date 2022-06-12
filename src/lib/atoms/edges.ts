import { Edge, EdgeAtomState, EdgeInProgressAtomState } from '@lib/types';
import { atomWithImmer } from 'jotai/immer';

export function createEdgeAtom(edge: Edge) {
  return atomWithImmer<EdgeAtomState>({
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

export const edgeInProgressAtomDefault = {
  active: false,
  reconnect: false,
  to: 'target',
  nodeId: '',
  handleId: '',
  ...emptySourceTarget,
} as const;

export const edgeInProgressAtom = atomWithImmer<EdgeInProgressAtomState>(edgeInProgressAtomDefault);
