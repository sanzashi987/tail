import type { NodeAtom, EdgeInProgressAtomType } from '@app/types';
import type { RecoilState } from 'recoil';

export function getAtom<T>(id: string, atomPool?: IObject<RecoilState<T>>) {
  const atom = atomPool?.[id];
  if (!atom) throw Error('fail to fetch atom from the pool');
  return atom;
}


export function createEdgeInProgressUpdater(x: number, y: number) {
  return function (prev: EdgeInProgressAtomType) {
    const next = { ...prev };
    [next.targetX, next.targetY] = [x, y];
    return next;
  };
}


