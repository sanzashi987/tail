import { CoordinateCalc } from '@lib/components/Dragger';
import type {
  EdgeAtom,
  EdgeInProgressAtomType,
  EdgeTree,
  HandleType,
  EdgeBasic,
  EdgeInProgressAtomUpdater,
  NodeAtom,
  AtomStateGetterType,
  ConnectMethodType,
  DraggerData,
  IObject,
} from '@lib/types';
import { edgeInProgressAtom } from '@lib/atoms/edges';
import type ItemActives from './itemActives';
import type TailCore from '..';

export function enableEdgeReconnect(prev: EdgeAtom): EdgeAtom {
  return {
    ...prev,
    hovered: false,
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
  edgePool: IObject<string>,
  nodeId: string,
  handleId: string,
) {
  const arr = [...(edgeTree.get(nodeId)?.get(handleId)?.keys() ?? [])];
  for (const edge of arr) {
    if (edgePool[edge]) {
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

export function addReconnectToState(
  state: EdgeInProgressAtomType,
  type: HandleType,
  prevEdgeId: string,
  atomStateGetter: AtomStateGetterType,
) {
  const next = { ...state };
  const opposite = flipHandle[type];
  const [X, Y] = handleToCoor[opposite];
  const oppositeNode = addHandleNode[opposite];
  const edgeState = atomStateGetter<EdgeAtom>('edge', prevEdgeId);
  if (!edgeState) return false;
  const { [opposite]: storedHandle, [oppositeNode]: storedNode } = edgeState.edge;
  const nodeState = atomStateGetter<NodeAtom>('node', storedNode);
  if (!nodeState) return false;
  const {
    handles: {
      [opposite]: {
        [storedHandle]: { x, y },
      },
    },
    node: { top, left },
  } = nodeState;
  [next[X], next[Y]] = [x + left, y + top];
  next.nodeId = storedNode;
  next.handleId = storedHandle;
  next.to = type;
  next.reconnect = true;
  next.prevEdgeId = prevEdgeId;
  return [opposite, next] as const;
}

export function createMoveCallback(setter: EdgeInProgressAtomUpdater, type: HandleType) {
  const moveUpdater = flipHandle[type] === 'source' ? setSource : setTarget;
  return (e: MouseEvent, { x, y }: DraggerData) => {
    setter(moveUpdater(x, y));
  };
}

export function validateExistEdge(edgeBasic: EdgeBasic, edgeTree: EdgeTree) {
  const { source, sourceNode, target, targetNode } = edgeBasic;
  const sourceEdges = [...(edgeTree.get(sourceNode)?.get(source)?.keys() ?? [])].reduce<
    IObject<string>
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
  constructor(private core: TailCore, private itemActives: ItemActives) {}
  onHandleMouseDown: ConnectMethodType = (e, type, nodeId, handleId) => {
    //only edge active will try reconnect
    let newType = type;
    const edgeAtoms = this.core.getEdgeAtoms();
    const { edgeTree } = this.core.edgeRef.current!;
    const onlyEdge = Object.keys(this.itemActives.activeItems.edge).length === 1;
    const possibleEdge =
      onlyEdge &&
      hasConnectedEdgeActive(edgeTree, this.itemActives.activeItems['edge'], nodeId, handleId);
    const nodeState = this.core.getAtomState<NodeAtom>('node', nodeId);
    if (!nodeState) return;
    const {
      handles: {
        [newType]: {
          [handleId]: { x, y },
        },
      },
      node: { left, top },
    } = nodeState;
    const [absX, absY] = [x + left, y + top];
    let basicState = createBasicConnect(newType, absX, absY, nodeId, handleId);
    if (possibleEdge !== false) {
      // reconnect
      const res = addReconnectToState(basicState, newType, possibleEdge, this.core.getAtomState);
      if (!res) return;
      [newType, basicState] = res;
      this.core.context.set(edgeAtoms[possibleEdge], enableEdgeReconnect);
    }
    this.edgeInProgressUpdater(basicState);
    this.dragger.start(e, {
      x: absX,
      y: absY,
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
    } = this.core.context.get(edgeInProgressAtom);
    block: {
      if (to === type && active) {
        const newPayload = createEdgePayload(to, nodeId, handleId, storedNode, storedHandle);
        const isNotExist = !validateExistEdge(newPayload, this.core.edgeRef.current!.edgeTree);
        if (reconnect && prevEdgeId) {
          const toNode = addHandleNode[type];
          const edgeState = this.core.getAtomState<EdgeAtom>('edge', prevEdgeId);
          if (!edgeState) break block;
          const { [type]: prevHandleId, [toNode]: prevNodeId } = edgeState.edge;
          if ((prevHandleId !== handleId || prevNodeId !== nodeId) && isNotExist) {
            this.core.props.onEdgeUpdate?.(prevEdgeId, newPayload);
          }
          this.core.setAtomState('edge', prevEdgeId, disableEdgeReconnect);
        } else if (isNotExist) {
          this.core.props.onEdgeCreate?.(newPayload);
        }
      }
    }
    this.connectReset();
  };

  private rollback = () => {
    const { reconnect, prevEdgeId } = this.core.context.get(edgeInProgressAtom);
    if (reconnect && prevEdgeId) {
      this.core.setAtomState<EdgeAtom>('edge', prevEdgeId, disableEdgeReconnect);
    }
    this.core.context.reset(edgeInProgressAtom);
  };

  private tryConnect = (e: MouseEvent, { x, y }: DraggerData) => {
    const { reconnect, prevEdgeId, to: type } = this.core.context.get(edgeInProgressAtom);

    block: {
      if (reconnect && prevEdgeId) {
        const { getAtomState: GET, setAtomState: SET } = this.core;
        const typeNode = addHandleNode[type];
        const edgeState = GET<EdgeAtom>('edge', prevEdgeId);
        if (!edgeState) break block;
        const {
          edge: { [typeNode]: originNode, [type]: originHandle },
        } = edgeState;
        const nodeState = GET<NodeAtom>('node', originNode);
        if (!nodeState) break block;
        const { x: X, y: Y } = nodeState.handles[type][originHandle];
        const threshold = this.core.props.dropThreshold!;
        if (Math.abs(x - X) < threshold && Math.abs(y - Y) < threshold) {
          SET<EdgeAtom>('edge', prevEdgeId, disableEdgeReconnect);
        } else {
          this.itemActives.switchActive(
            'edge',
            prevEdgeId,
            false,
            this.itemActives.activeItems['edge'],
          );
          this.core.deleteItem([{ type: 'edge', id: prevEdgeId }]);
        }
      }
    }

    this.core.context.reset(edgeInProgressAtom);
  };

  private connectReset = () => {
    this.dragger.reset();
    this.core.context.reset(edgeInProgressAtom);
  };

  private edgeInProgressUpdater: EdgeInProgressAtomUpdater = (updater) => {
    this.core.context.set(edgeInProgressAtom, updater);
  };
}

export default EdgeConnects;
