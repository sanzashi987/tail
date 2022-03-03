import type {
  EdgeAtom,
  EdgeInProgressAtomType,
  EdgeTree,
  HandleType,
  RecoilNexusInterface,
  SelectedItemCollection,
  EdgeBasic,
  EdgeInProgressAtomUpdater,
  SelectedItemType,
  NodeAtom,
  AtomStateGetterType,
} from '@types';
import { RecoilState } from 'recoil';

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
    if (activePool[edge]?.type === 'edge') {
      return edge;
    }
  }
  return false;
}

export const flipHandle = {
  source: 'target',
  target: 'source',
} as const;
const flipHandleNode = {
  source: 'targetNode',
  target: 'sourceNode',
} as const;
export const addHandleNode = {
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
  const storedHandle = flipHandle[to];
  const storedNode = flipHandleNode[to];
  const toNode = addHandleNode[to];
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
    to: flipHandle[to],
    nodeId,
    handleId,
    sourceX: x,
    sourceY: y,
    targetX: x,
    targetY: y,
  };
}

export function addReconnectToState(
  state: EdgeInProgressAtomType,
  type: HandleType,
  prevEdgeId: string,
  atomStateGetter: AtomStateGetterType,
) {
  const next = { ...state };
  const [X, Y] = handleToCoor[type];
  const toNode = addHandleNode[type];
  const opposite = flipHandle[type];
  const oppositeNode = addHandleNode[opposite];
  const {
    [toNode]: nodeId,
    [type]: handleId,
    [opposite]: storedHandle,
    [oppositeNode]: storedNode,
  } = atomStateGetter<EdgeAtom>('edge', prevEdgeId).edge;
  const {
    [handleId]: { x, y },
  } = atomStateGetter<NodeAtom>('node', nodeId).handles[type];
  [next[X], next[Y]] = [x, y];
  next.nodeId = storedNode;
  next.handleId = storedHandle;
  next.to = type;
  next.reconnect = true;
  next.prevEdgeId = prevEdgeId;
  return next;
}

export function createMoveCallback(setter: EdgeInProgressAtomUpdater, type: HandleType) {
  const moveUpdater = flipHandle[type] === 'source' ? setSource : setTarget;
  return (x: number, y: number) => {
    setter(moveUpdater(x, y));
  };
}
