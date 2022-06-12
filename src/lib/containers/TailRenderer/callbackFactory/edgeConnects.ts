import { CoordinateCalc } from '@lib/components/Dragger';
import type {
  EdgeAtomState,
  EdgeInProgressAtomState,
  EdgeTree,
  EdgeBasic,
  EdgeInProgressAtomUpdater,
} from '@lib/types/edges';
import { HandleType, ConnectMethodType, DraggerData, coordinates } from '@lib/types';
import { AtomGetter, AtomSetter } from '@lib/types/jotai';
import { edgeInProgressAtom, edgeInProgressAtomDefault } from '@lib/atoms/edges';
import type TailCore from '..';

function enableEdgeReconnect(prev: EdgeAtomState): EdgeAtomState {
  return {
    ...prev,
    hovered: false,
    reconnect: true,
  };
}

function disableEdgeReconnect(prev: EdgeAtomState): EdgeAtomState {
  return {
    ...prev,
    reconnect: false,
  };
}

function hasConnectedEdgeActive(
  edgeTree: EdgeTree,
  edgeId: string,
  nodeId: string,
  handleId: string,
) {
  const arr = [...(edgeTree.get(nodeId)?.get(handleId)?.keys() ?? [])];
  if (arr.includes(edgeId)) return edgeId;
  return false;
}

const flipHandle = {
  source: 'target',
  target: 'source',
} as const;
const flipHandleNode = {
  source: 'targetNode',
  target: 'sourceNode',
} as const;
const addHandleNode = {
  source: 'sourceNode',
  target: 'targetNode',
} as const;

const handleToCoor = {
  source: ['sourceX', 'sourceY'],
  target: ['targetX', 'targetY'],
} as const;

function createEdgePayload(
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

function setTarget(x: number, y: number) {
  return function (prev: EdgeInProgressAtomState) {
    const next = { ...prev };
    [next.targetX, next.targetY] = [x, y];
    return next;
  };
}

function setSource(x: number, y: number) {
  return function (prev: EdgeInProgressAtomState) {
    const next = { ...prev };
    [next.sourceX, next.sourceY] = [x, y];
    return next;
  };
}

function createBasicConnect(
  to: HandleType,
  x: number,
  y: number,
  nodeId: string,
  handleId: string,
): EdgeInProgressAtomState {
  return {
    active: true,
    reconnect: false,
    to: flipHandle[to],
    nodeId,
    handleId,
    sourceX: x,
    sourceY: y,
    targetX: x,
    targetY: y,
  };
}

function addReconnectToState(
  this: EdgeConnects,
  state: EdgeInProgressAtomState,
  type: HandleType,
  prevEdgeId: string,
) {
  const next = { ...state };
  const opposite = flipHandle[type];
  const [X, Y] = handleToCoor[opposite];
  const oppositeNode = addHandleNode[opposite];
  const edgeState = this.parser.edgeUpdater.getState(prevEdgeId);
  if (!edgeState) return false;
  const { [opposite]: storedHandle, [oppositeNode]: storedNode } = edgeState.edge;
  const handleCoor = this.getHandleAbsCoordinate(storedNode, opposite, storedHandle);
  if (!handleCoor) return false;
  next[X] = handleCoor.x;
  next[Y] = handleCoor.y;
  next.nodeId = storedNode;
  next.handleId = storedHandle;
  next.to = type;
  next.reconnect = true;
  next.prevEdgeId = prevEdgeId;
  return [opposite, next] as const;
}

function createMoveCallback(setter: EdgeInProgressAtomUpdater, type: HandleType) {
  const moveUpdater = flipHandle[type] === 'source' ? setSource : setTarget;
  return (e: MouseEvent, { x, y }: DraggerData) => {
    setter(moveUpdater(x, y));
  };
}

function validateExistEdge(edgeBasic: EdgeBasic, edgeTree: EdgeTree) {
  const { source, sourceNode, target, targetNode } = edgeBasic;
  const sourceEdges = [...(edgeTree.get(sourceNode)?.get(source)?.keys() ?? [])].reduce<
    Record<string, string>
  >((prev, key) => {
    prev[key] = key;
    return prev;
  }, {});
  for (const edge of [...(edgeTree.get(targetNode)?.get(target)?.keys() ?? [])]) {
    if (sourceEdges[edge]) return true;
  }
  return false;
}

class EdgeConnects {
  private dragger = new CoordinateCalc();
  constructor(private core: TailCore) {}
  get parser() {
    return this.core.context;
  }

  edgeAtomSetter: AtomSetter<EdgeInProgressAtomState> = (atom, updater) => {
    this.core.context.edgeUpdater.setter(atom as any, updater as any);
  };
  edgeAtomGetter: AtomGetter<EdgeInProgressAtomState> = (atom) => {
    return this.core.context.edgeUpdater.getter(atom as any) as unknown as EdgeInProgressAtomState;
  };

  onHandleMouseDown: ConnectMethodType = (e, type, nodeId, handleId) => {
    //only edge active will try reconnect
    let newType = type;
    const { edgeTree } = this.parser.edgeUpdater;
    const activeEdges = this.parser.edgeSelector.currentItems;
    const possibleEdge =
      activeEdges.length === 1 &&
      hasConnectedEdgeActive(edgeTree, activeEdges[0], nodeId, handleId);
    const handleAbs = this.getHandleAbsCoordinate(nodeId, newType, handleId);
    if (!handleAbs) return;
    const { x, y } = handleAbs;
    let basicState = createBasicConnect(newType, x, y, nodeId, handleId);
    if (possibleEdge !== false) {
      // reconnect
      const res = addReconnectToState.call(this, basicState, newType, possibleEdge);
      if (!res) return;
      [newType, basicState] = res;
      this.parser.edgeUpdater.setState(possibleEdge, enableEdgeReconnect);
    }
    this.edgeInProgressUpdater(basicState);
    this.dragger.start(e, {
      x,
      y,
      parent: document.body,
      getScale: this.core.getScale,
      movecb: createMoveCallback(this.edgeInProgressUpdater, newType),
      endcb: this.rollback,
    });
  };

  onHandleMouseUp: ConnectMethodType = (e, type, nodeId, handleId) => {
    e.stopPropagation();
    const {
      active,
      reconnect,
      prevEdgeId,
      to,
      nodeId: storedNode,
      handleId: storedHandle,
    } = this.edgeAtomGetter(edgeInProgressAtom);
    block: {
      if (to === type && active) {
        const newPayload = createEdgePayload(to, nodeId, handleId, storedNode, storedHandle);
        const isNotExist = !validateExistEdge(newPayload, this.parser.edgeUpdater.edgeTree);
        if (reconnect && prevEdgeId) {
          const toNode = addHandleNode[type];
          const edgeState = this.parser.edgeUpdater.getState(prevEdgeId);
          if (!edgeState) break block;
          const { [type]: prevHandleId, [toNode]: prevNodeId } = edgeState.edge;
          if ((prevHandleId !== handleId || prevNodeId !== nodeId) && isNotExist) {
            this.core.props.onEdgeUpdate?.(prevEdgeId, newPayload);
          }
          this.parser.edgeUpdater.setState(prevEdgeId, disableEdgeReconnect);
        } else if (isNotExist) {
          this.core.props.onEdgeCreate?.(newPayload);
        }
      }
    }
    this.connectReset();
  };

  private rollback = () => {
    const { reconnect, prevEdgeId } = this.edgeAtomGetter(edgeInProgressAtom);
    if (reconnect && prevEdgeId) {
      this.parser.edgeUpdater.setState(prevEdgeId, disableEdgeReconnect);
    }
    this.edgeAtomSetter(edgeInProgressAtom, edgeInProgressAtomDefault);
  };

  private connectReset = () => {
    this.dragger.reset();
    this.edgeAtomSetter(edgeInProgressAtom, edgeInProgressAtomDefault);
  };

  private edgeInProgressUpdater: EdgeInProgressAtomUpdater = (updater) => {
    this.edgeAtomSetter(edgeInProgressAtom, updater);
  };

  protected getHandleAbsCoordinate(nodeId: string, handleType: HandleType, handleId: string) {
    const nodeState = this.parser.nodeUpdater.getState(nodeId);
    if (!nodeState) return null;
    const {
      handles: {
        [handleType]: {
          [handleId]: { x, y },
        },
      },
      node: { left, top },
    } = nodeState;
    return { x: x + left, y: y + top } as coordinates;
  }
}

export default EdgeConnects;
