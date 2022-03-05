import { CoordinateCalc } from '@app/components/Dragger';
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
} from '@types';
import TailCore from '..';
import ItemActives from './itemActives';
import { edgeInProgressAtom } from '@app/atoms/edges';

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
  const { [opposite]: storedHandle, [oppositeNode]: storedNode } = atomStateGetter<EdgeAtom>(
    'edge',
    prevEdgeId,
  ).edge;
  const {
    handles: {
      [opposite]: {
        [storedHandle]: { x, y },
      },
    },
    node: { top, left },
  } = atomStateGetter<NodeAtom>('node', storedNode);
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
  return (x: number, y: number) => {
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
  dragger = new CoordinateCalc();
  constructor(private core: TailCore, private itemActives: ItemActives) {}
  onHandleMouseDown: ConnectMethodType = (e, type, nodeId, handleId) => {
    //only edge active will try reconnect
    let newType = type;
    const { edgeTree, edgeAtoms } = this.core.edgeRef.current!;
    const possibleEdge = hasConnectedEdgeActive(
      edgeTree,
      this.core.activeItems['edge'],
      nodeId,
      handleId,
    );
    const {
      handles: {
        [newType]: {
          [handleId]: { x, y },
        },
      },
      node: { left, top },
    } = this.core.getAtomState<NodeAtom>('node', nodeId);
    const [absX, absY] = [x + left, y + top];
    let basicState = createBasicConnect(newType, absX, absY, nodeId, handleId);
    if (possibleEdge !== false) {
      // reconnect
      [newType, basicState] = addReconnectToState(
        basicState,
        newType,
        possibleEdge,
        this.core.getAtomState,
      );
      this.core.context.set(edgeAtoms[possibleEdge], enableEdgeReconnect);
    }
    this.core.edgeInProgressUpdater(basicState);
    this.dragger.start(e, {
      x: absX,
      y: absY,
      parent: document.body,
      getScale: this.core.getScale,
      movecb: createMoveCallback(this.core.edgeInProgressUpdater, newType),
      endcb: this.tryConnect,
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
    if (to === type && active) {
      const newPayload = createEdgePayload(to, nodeId, handleId, storedNode, storedHandle);
      if (reconnect && prevEdgeId) {
        const toNode = addHandleNode[type];
        const { [type]: prevHandleId, [toNode]: prevNodeId } = this.core.getAtomState<EdgeAtom>(
          'edge',
          prevEdgeId,
        ).edge;
        if (prevHandleId !== handleId || prevNodeId !== nodeId) {
          this.core.props.onEdgeUpdate(prevEdgeId, newPayload);
          this.core.setAtomState('edge', prevEdgeId, disableEdgeReconnect);
        }
      } else if (!validateExistEdge(newPayload, this.core.edgeRef.current!.edgeTree)) {
        this.core.props.onEdgeCreate(newPayload);
      }
    }
    this.connectReset();
  };

  private tryConnect = (x: number, y: number) => {
    const { reconnect, prevEdgeId, to: type } = this.core.context.get(edgeInProgressAtom);
    if (reconnect && prevEdgeId) {
      const { getAtomState: GET, setAtomState: SET } = this.core;
      const typeNode = addHandleNode[type];
      const {
        edge: { [typeNode]: originNode, [type]: originHandle },
      } = GET<EdgeAtom>('edge', prevEdgeId);
      const { x: X, y: Y } = GET<NodeAtom>('node', originNode).handles[type][originHandle];
      const threshold = this.core.props.dropThreshold;
      if (Math.abs(x - X) < threshold && Math.abs(y - Y) < threshold) {
        SET<EdgeAtom>('edge', prevEdgeId, disableEdgeReconnect);
      } else {
        this.core.deleteItem([{ type: 'edge', id: prevEdgeId }]);
        this.itemActives.switchActive('edge', prevEdgeId, false, this.core.activeItems['edge']);
      }
    }
    this.core.context.reset(edgeInProgressAtom);
  };

  private connectReset = () => {
    this.dragger.reset();
    this.core.context.reset(edgeInProgressAtom);
  };
}

export default EdgeConnects;