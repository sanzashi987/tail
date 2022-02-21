import type {
  NodeAtomsType,
  EdgeAtomsType,
  EdgeAtom,
  NodeAtom,
  EdgeInProgressAtomType,
} from '@app/types';
import type { RecoilState } from 'recoil';

export function getAtom(id: string, atomPool?: NodeAtomsType | EdgeAtomsType) {
  const atom = atomPool?.[id];
  if (!atom) throw Error('fail to fetch atom from the pool');
  return atom as RecoilState<NodeAtom | EdgeAtom>;
}

export function immutableSelectedHandles(prev: NodeAtom) {
  const next = { ...prev };
  next.selectedHandles = { ...next.selectedHandles };
  return next;
}

export function deactivateHandle(next: NodeAtom, handleId: string) {
  const linked = next.selectedHandles[handleId];
  if (linked === 1) {
    delete next.selectedHandles[handleId];
  } else {
    next.selectedHandles[handleId] = linked - 1;
  }
}

export function activateHandle(next: NodeAtom, handleId: string) {
  const linked = next.selectedHandles[handleId];
  next.selectedHandles[handleId] = typeof linked === 'number' && linked === linked ? linked + 1 : 1;
}

export function activateEgdeInProgress(
  x: number,
  y: number,
  source: string,
  sourceNode: string,
): EdgeInProgressAtomType {
  return {
    active: true,
    source,
    sourceNode,
    sourceX: x,
    targetX: x,
    sourceY: y,
    targetY: y,
  };
}
