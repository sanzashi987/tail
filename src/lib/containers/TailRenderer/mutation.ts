import type { NodeAtomsType, EdgeAtomsType, EdgeAtom, NodeAtom } from '@app/types';
import type { RecoilState } from 'recoil';

export function getAtom(id: string, atomPool?: NodeAtomsType | EdgeAtomsType) {
  const atom = atomPool?.[id];
  if (!atom) throw Error('fail to fetch atom pool');
  return atom as RecoilState<NodeAtom | EdgeAtom>;
}
