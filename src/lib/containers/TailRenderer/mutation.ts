import type { RecoilState } from 'recoil';

export function getAtom<T>(id: string, atomPool?: IObject<RecoilState<T>>) {
  const atom = atomPool?.[id];
  if (!atom) throw Error('fail to fetch atom from the pool');
  return atom;
}
