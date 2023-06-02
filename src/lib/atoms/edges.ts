import { Edge, EdgeAtomState, EdgeInProgressAtomState } from '@lib/types';
import { atomWithImmer } from 'jotai/immer';

export function createEdgeAtom(
  edge: Edge,
  describerOverride: Partial<Omit<EdgeAtomState, 'edge'>> = {},
) {
  return atomWithImmer<EdgeAtomState>({
    edge,
    selected: false,
    hovered: false,
    reconnect: false,
    forceRender: 0,
    ...describerOverride,
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
  pairedStatus: null,
  ...emptySourceTarget,
} as const;

export const edgeInProgressAtom = atomWithImmer<EdgeInProgressAtomState>(edgeInProgressAtomDefault);
