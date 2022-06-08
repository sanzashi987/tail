import type { Edge, EdgeTree } from '@lib/types';
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
  this.updater(this.atoms[nextItem.id], updater);
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
