import type { Edge, EdgeTree, HandleTree } from '@lib/types';
import type { Draft } from 'immer';

export function removeChild(edgeTree: EdgeTree, edge: Edge) {
  const { source, sourceNode, target, targetNode, id } = edge;
  edgeTree.get(sourceNode)?.get(source)?.delete(id);
  edgeTree.get(targetNode)?.get(target)?.delete(id);
}

function ensureParent<T extends Map<string, any>>(tree: T, parentId: string) {
  if (tree.get(parentId) === undefined) {
    tree.set(parentId, new Map());
  }
  return tree.get(parentId)!;
}

function setChild(
  edgeTree: EdgeTree,
  nodeId: string,
  handleId: string,
  edgeId: string,
  edge: Edge,
) {
  const nodeMap = ensureParent<EdgeTree>(edgeTree, nodeId);
  ensureParent<HandleTree>(nodeMap, handleId).set(edgeId, edge);
}

export function registerChild(edgeTree: EdgeTree, edge: Edge) {
  const { source, sourceNode, target, targetNode, id } = edge;
  setChild(edgeTree, sourceNode, source, id, edge);
  setChild(edgeTree, targetNode, target, id, edge);
}

export function selectItem(draft: Draft<any>) {
  draft.selected = true;
}
export function unselectItem(draft: Draft<any>) {
  draft.selected = false;
}

// function immutableSelectedHandles(prev: NodeAtomState) {
//   const next = { ...prev };
//   next.selectedHandles = { ...next.selectedHandles };
//   return next;
// }

// function deactivateHandle(next: NodeAtomState, handleId: string) {
//   const linked = next.selectedHandles[handleId];
//   if (linked === 1) {
//     delete next.selectedHandles[handleId];
//   } else {
//     next.selectedHandles[handleId] = linked - 1;
//   }
// }

// function activateHandle(next: NodeAtomState, handleId: string) {
//   const linked = next.selectedHandles[handleId];
//   next.selectedHandles[handleId] = typeof linked === 'number' && linked === linked ? linked + 1 : 1;
// }

// function setSelectedHandle(
//   nodeId: string,
//   handleId: string,
//   cb: (next: NodeAtomState, handleId: string) => void,
//   setter: (atom: NodeAtom, updater: UpdaterType<NodeAtomsType>) => void,
// ) {
//   setter(atom, (prev) => {
//     const next = immutableSelectedHandles(prev);
//     cb(next, handleId);
//     return next;
//   });
// }
