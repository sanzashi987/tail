import type { Edge, EdgeTree } from '@lib/types';

export const defaultProps = { templates: {} };

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
