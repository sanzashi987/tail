import type { Edge, EdgeTree, EdgeRendererProps } from "@types";

export function removeChild(edgeTree: EdgeTree, edge: Edge) {
  const { source, sourceNode, target, targetNode, id } = edge;
  edgeTree.get(sourceNode)?.get(source)?.delete(id);
  edgeTree.get(targetNode)?.get(target)?.delete(id);
}

function ensureParent(tree: Map<string, any>, parentId: string) {
  if (tree.get(parentId) === undefined) {
    tree.set(parentId, new Map());
  }
}

function setChild(edgeTree: EdgeTree, nodeId: string, handleId: string, edgeId: string) {
  ensureParent(edgeTree, nodeId);
  const nodeMap = edgeTree.get(nodeId)!;
  ensureParent(nodeMap, handleId);
  nodeMap.get(handleId)!.set(edgeId, edgeId);
}

export function registerChild(edgeTree: EdgeTree, edge: Edge) {
  const { source, sourceNode, target, targetNode, id } = edge;
  setChild(edgeTree, sourceNode, source, id);
  setChild(edgeTree, targetNode, target, id);
}
