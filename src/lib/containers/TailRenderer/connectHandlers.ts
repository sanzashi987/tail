import type {
  ConnectMethodType,
  EdgeAtom,
  EdgeInProgressAtomType,
  EdgeTree,
  HandleType,
  RecoilNexusInterface,
  SelectedItemCollection,
  EdgeBasic,
  EdgeInProgressAtomUpdater,
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

export function hasConnectedEdgeActive(
  edgeTree: EdgeTree,
  activePool: SelectedItemCollection,
  nodeId: string,
  handleId: string,
) {
  const arr = [...(edgeTree.get(nodeId)?.get(handleId)?.keys() ?? [])];
  for (const edge of arr) {
    if (activePool[edge].type === 'edge') {
      return edge;
    }
  }
  return false;
}

export const oppositeHandleType = {
  source: 'target',
  target: 'source',
} as const;
const oppositeNodeType = {
  source: 'targetNode',
  target: 'sourceNode',
} as const;
const handleTypeToNode = {
  source: 'sourceNode',
  target: 'targetNode',
} as const;

const handleToCoor = {
  source: ['sourceX', 'sourceY'],
  target: ['targetX', 'targetY'],
} as const;

export function createEdgePayload(
  to: HandleType,
  nodeId: string,
  handleId: string,
  nodeIdStored: string,
  handleIdStored: string,
) {
  const storedHandle = oppositeHandleType[to];
  const storedNode = oppositeNodeType[to];
  const toNode = handleTypeToNode[to];
  return {
    [storedNode]: nodeIdStored,
    [storedHandle]: handleIdStored,
    [to]: handleId,
    [toNode]: nodeId,
  } as EdgeBasic;
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

export function createBasicConnect(
  to: HandleType,
  x: number,
  y: number,
  nodeId: string,
  handleId: string,
): EdgeInProgressAtomType {
  return {
    active: true,
    to,
    nodeId,
    handleId,
    sourceX: x,
    sourceY: y,
    targetX: x,
    targetY: y,
  };
}

export function createMoveCallback(setter: EdgeInProgressAtomUpdater, type: HandleType) {
  const moveUpdater = type === 'source' ? setSource : setTarget;
  return (x: number, y: number) => {
    setter(moveUpdater(x, y));
  };
}
