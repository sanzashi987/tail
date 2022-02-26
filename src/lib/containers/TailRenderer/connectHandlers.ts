import type { EdgeAtom, EdgeInProgressAtomType } from '@types';
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

export function createEdgeInProgressUpdater(x: number, y: number) {
  return function (prev: EdgeInProgressAtomType) {
    const next = { ...prev };
    [next.targetX, next.targetY] = [x, y];
    return next;
  };
}

enum OppositeHandleType {
  'source' = 'target',
  'target' = 'source',
}

class ConnectProcessor {
  dragger = new CoordinateCalc();

  
}
