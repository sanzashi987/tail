import type { Edge, EdgeTree } from '@lib/types';
import type { Draft } from 'immer';
import type { ItemUpdater } from './itemUpdater';

export function deleteItem<T extends { id: string }, A>(this: ItemUpdater<T, A>, item: T) {
  this.emit('delete', item);
  delete this.atoms[item.id];
}

export function mountItem<T extends { id: string }, A>(this: ItemUpdater<T, A>, item: T) {
  const atom = this.createAtom(item);
  this.atoms[item.id] = atom;
  this.emit('mount', item, atom);
}

export function updateItem<T extends { id: string }, A>(
  this: ItemUpdater<T, A>,
  lastItem: T,
  nextItem: T,
) {
  // if (lastItem.id !== nextItem.id) {
  //   console.error('error input ==>', lastItem, nextItem);
  //   throw new Error('fail to update the item as their id is different');
  // }
  const updater = this.createAtomUpdater(nextItem);
  this.setter(this.atoms[nextItem.id], updater);
  this.emit('update');
}

export function removeChild(edgeTree: EdgeTree, edge: Edge) {
  const { source, sourceNode, target, targetNode, id } = edge;
  edgeTree.get(sourceNode)?.get(source)?.delete(id);
  edgeTree.get(targetNode)?.get(target)?.delete(id);
}

function ensureParent(tree: Map<string, any>, parentId: string) {
  if (tree.get(parentId) === undefined) {
    tree.set(parentId, new Map());
  }
  return tree.get(parentId)!;
}

function setChild(edgeTree: EdgeTree, nodeId: string, handleId: string, edgeId: string) {
  const nodeMap = ensureParent(edgeTree, nodeId);
  ensureParent(nodeMap, handleId).set(edgeId, edgeId);
}

export function registerChild(edgeTree: EdgeTree, edge: Edge) {
  const { source, sourceNode, target, targetNode, id } = edge;
  setChild(edgeTree, sourceNode, source, id);
  setChild(edgeTree, targetNode, target, id);
}

export function selectItem(draft: Draft<any>) {
  draft.selected = true;
}
export function unselectItem(draft: Draft<any>) {
  draft.selected = false;
}

function immutableSelectedHandles(prev: NodeAtom) {
  const next = { ...prev };
  next.selectedHandles = { ...next.selectedHandles };
  return next;
}

function deactivateHandle(next: NodeAtom, handleId: string) {
  const linked = next.selectedHandles[handleId];
  if (linked === 1) {
    delete next.selectedHandles[handleId];
  } else {
    next.selectedHandles[handleId] = linked - 1;
  }
}

function activateHandle(next: NodeAtom, handleId: string) {
  const linked = next.selectedHandles[handleId];
  next.selectedHandles[handleId] = typeof linked === 'number' && linked === linked ? linked + 1 : 1;
}

function setSelectedHandle(
  nodeId: string,
  handleId: string,
  cb: (next: NodeAtom, handleId: string) => void,
  setter: (atom: RecoilState<NodeAtom>, updater: NodeAtom | ((cur: NodeAtom) => NodeAtom)) => void,
) {
  const atom = getAtom(nodeId, nodePool);
  atom &&
    setter(atom, (prev) => {
      const next = immutableSelectedHandles(prev);
      cb(next, handleId);
      return next;
    });
}
