import type { EdgeTree, NodeAtom } from '@lib/types';
import type { RecoilState } from 'recoil';

export function getAtom<T>(id: string, atomPool?: Record<string, RecoilState<T>>) {
  const atom = atomPool?.[id];
  if (!atom) {
    console.warn('fail to fetch atom from the pool', id);
    return false;
  }
  return atom;
}

export const flatNodeEdgeMap = (edgeTree: EdgeTree) => {
  return [...edgeTree.keys()].reduce<string[]>((last, curr) => {
    return last.concat(getConnectedEdgeByNode(curr, edgeTree));
  }, []);
};

export const getConnectedEdgeByNode = (nodeId: string, edgeTree: EdgeTree) => {
  const handles = edgeTree.get(nodeId)?.values();
  if (!handles) return [];

  const res = [...handles].reduce<string[]>((last, handle) => {
    return last.concat([...handle.values()]);
  }, []);
  return res;
};

export function createNodeDeltaMove(deltaX: number, deltaY: number) {
  return function (prev: NodeAtom): NodeAtom {
    return {
      ...prev,
      node: {
        ...prev.node,
        left: prev.node.left + deltaX,
        top: prev.node.top + deltaY,
      },
    };
  };
}
