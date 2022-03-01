import type { DeletePayload, EdgeTree } from '@app/types';
import type { RecoilState } from 'recoil';

export function getAtom<T>(id: string, atomPool?: IObject<RecoilState<T>>) {
  const atom = atomPool?.[id];
  if (!atom) throw Error('fail to fetch atom from the pool');
  return atom;
}

export function findDeletedItem(edgeTree: EdgeTree, payload: DeletePayload) {
  const edges: string[] = [],
    nodes: string[] = [];
  payload.forEach((val) => {
    const { type, id } = val;
    if (type === 'node') {
      nodes.push(id);
      const keys = edgeTree.get(id)?.keys() ?? [];
      edges.push(...keys);
    } else if (type === 'edge') {
      edges.push(id);
    }
  });

  return { nodes, edges };
}
