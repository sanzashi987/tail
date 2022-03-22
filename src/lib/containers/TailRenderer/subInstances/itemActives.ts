import type {
  SelectedItemType,
  EdgeAtom,
  NodeAtom,
  coordinates,
  SelectCallback,
} from '@app/types';
import type { RecoilState } from 'recoil';
import { CtrlOrCmd, isModifierExact } from '@app/utils';
import { getAtom } from '../mutation';
import type TailCore from '..';

function immutableSelectedHandles(prev: NodeAtom) {
  const next = { ...prev };
  next.selectedHandles = { ...next.selectedHandles };
  return next;
}

function deactivateHandle(next: NodeAtom, handleId: string) {
  const linked = next.selectedHandles[handleId];
  if (linked === 1) {
    delete next.selectedHandles[handleId];
  } else {
    next.selectedHandles[handleId] = linked - 1;
  }
}

function activateHandle(next: NodeAtom, handleId: string) {
  const linked = next.selectedHandles[handleId];
  next.selectedHandles[handleId] = typeof linked === 'number' && linked === linked ? linked + 1 : 1;
}

function setSelectedHandle(
  nodeId: string,
  handleId: string,
  nodePool: IObject<RecoilState<NodeAtom>> | undefined,
  cb: (next: NodeAtom, handleId: string) => void,
  setter: (atom: RecoilState<NodeAtom>, updater: NodeAtom | ((cur: NodeAtom) => NodeAtom)) => void,
) {
  const atom = getAtom(nodeId, nodePool);
  setter(atom, (prev) => {
    const next = immutableSelectedHandles(prev);
    cb(next, handleId);
    return next;
  });
}

function sort(a: number, b: number) {
  return a - b;
}

function isInside(
  comStart: coordinates,
  comEnd: coordinates,
  svgStart: coordinates,
  svgEnd: coordinates,
): boolean {
  if (
    comStart.x > svgEnd.x ||
    svgStart.x > comEnd.x ||
    comStart.y > svgEnd.y ||
    svgStart.y > comEnd.y ||
    svgStart.x === svgEnd.x ||
    svgStart.y === svgEnd.y
  ) {
    return false;
  }
  return true;
}

export function switchActive(
  _this: TailCore,
  type: SelectedItemType,
  id: string,
  active: boolean,
  activePool: IObject<string>,
) {
  active ? (activePool[id] = id) : delete activePool[id];
  const atom = _this.getAtom(type, id);
  const { set, get } = _this.context;
  set(atom as RecoilState<NodeAtom | EdgeAtom>, (prev) => {
    const next = { ...prev };
    next.selected = active;
    return next;
  });
  if (type !== 'edge') return;
  const cb = active ? activateHandle : deactivateHandle;
  const {
    edge: { sourceNode, target, targetNode, source },
  } = get(atom as RecoilState<EdgeAtom>)!;
  const pool = _this.getNodeAtoms();
  setSelectedHandle(sourceNode, source, pool, cb, set);
  setSelectedHandle(targetNode, target, pool, cb, set);
}

class ItemActives {
  constructor(private core: TailCore) {}

  activateNext = (e: React.MouseEvent, type: SelectedItemType, id: string, selected: boolean) => {
    const hold = isModifierExact(e) && CtrlOrCmd(e);
    if (!hold && selected) return;
    if (!hold) {
      this.deactivateLast();
    }
    this.switchActive(type, id, !selected, this.core.activeItems[type]);
  };

  deactivateLast = () => {
    this.batchDeactivate('node');
    this.batchDeactivate('edge');
  };

  private batchDeactivate(type: SelectedItemType) {
    const pool = this.core.activeItems[type];
    Object.keys(pool).forEach((key) => {
      this.switchActive(type, key, false, pool);
    });
  }

  switchActive = (
    type: SelectedItemType,
    id: string,
    active: boolean,
    activePool: IObject<string>,
  ) => {
    active ? (activePool[id] = id) : delete activePool[id];
    const _this = this.core;
    const atom = _this.getAtom(type, id);
    const { set, get } = _this.context;
    set(atom as RecoilState<NodeAtom | EdgeAtom>, (prev) => ({ ...prev, selected: active }));
    if (type !== 'edge') return;
    const cb = active ? activateHandle : deactivateHandle;
    const {
      edge: { sourceNode, target, targetNode, source },
    } = get(atom as RecoilState<EdgeAtom>);
    const pool = _this.getNodeAtoms();
    setSelectedHandle(sourceNode, source, pool, cb, set);
    setSelectedHandle(targetNode, target, pool, cb, set);
  };

  batchActivateNodes: SelectCallback = (topleft, bottomRight, offset, scale) => {
    const pool = this.core.activeItems['node'];
    const startX = (topleft.x - offset.x) / scale;
    const startY = (topleft.y - offset.y) / scale;
    const endX = (bottomRight.x - offset.x) / scale;
    const endY = (bottomRight.y - offset.y) / scale;
    const [xMin, xMax, yMin, yMax] = [...[startX, endX].sort(sort), ...[startY, endY].sort(sort)];
    Object.keys(this.core.nodeRef.current!.nodeAtoms).forEach((key) => {
      const {
        rect: { width, height },
        node: { left, top },
      } = this.core.getAtomState<NodeAtom>('node', key);
      const [xCurMin, xCurMax, yCurMin, yCurMax] = [left, left + width, top, top + height];
      if (
        isInside(
          { x: xCurMin, y: yCurMin },
          { x: xCurMax, y: yCurMax },
          { x: xMin, y: yMin },
          { x: xMax, y: yMax },
        )
      ) {
        this.switchActive('node', key, true, pool);
      }
    });
  };
}

export default ItemActives;
