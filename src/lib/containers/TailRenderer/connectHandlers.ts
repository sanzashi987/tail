import type {
  ConnectMethodType,
  EdgeAtom,
  EdgeInProgressAtomType,
  EdgeTree,
  RecoilNexusInterface,
  SelectedItemCollection,
} from '@types';
import { CoordinateCalc } from '@app/components/Dragger';

export function activateEgdeInProgress(
  x: number,
  y: number,
  source: string,
  sourceNode: string,
): EdgeInProgressAtomType {
  return {
    active: true,
    source,
    sourceNode,
    sourceX: x,
    targetX: x,
    sourceY: y,
    targetY: y,
  };
}

export function activateEgdeInProgressReconnect(
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  source: string,
  sourceNode: string,
  prevEdgeId: string,
) {
  return {
    active: true,
    sourceX,
    sourceY,
    targetX,
    targetY,
    source,
    sourceNode,
    prevEdgeId,
  };
}

export function enableEdgeReconnect(prev: EdgeAtom): EdgeAtom {
  return {
    ...prev,
    reconnect: true,
  };
}

export function disableEdgeReconnect(prev: EdgeAtom): EdgeAtom {
  return {
    ...prev,
    reconnect: false,
  };
}

export function setTarget(x: number, y: number) {
  return function (prev: EdgeInProgressAtomType) {
    const next = { ...prev };
    [next.targetX, next.targetY] = [x, y];
    return next;
  };
}

export function setSource(x: number, y: number) {
  return function (prev: EdgeInProgressAtomType) {
    const next = { ...prev };
    [next.sourceX, next.sourceY] = [x, y];
    return next;
  };
}

enum OppositeHandleType {
  'source' = 'target',
  'target' = 'source',
}

export function hasConnectedEdgeActive(
  edgeTree: EdgeTree,
  activePool: SelectedItemCollection,
  nodeId: string,
  handleId: string,
) {
  const arr = [...edgeTree.get(nodeId)?.get(handleId)?.keys() ?? []];
  for (const edge of arr) {
    if (activePool[edge].type === 'edge') {
      return edge;
    }
  }
  return false;
}
