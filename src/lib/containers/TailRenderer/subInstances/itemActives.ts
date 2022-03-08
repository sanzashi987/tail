import type { SelectedItemType, EdgeAtom, NodeAtom, SelectedItemCollection } from '@app/types';
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

  batchDeactivate(type: SelectedItemType) {
    const pool = this.core.activeItems[type];
    Object.keys(pool).forEach((key) => {
      this.switchActive('node', key, false, pool);
    });
  }

  switchActive(type: SelectedItemType, id: string, active: boolean, activePool: IObject<string>) {
    active ? (activePool[id] = id) : delete activePool[id];
    const _this = this.core;
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
}

export default ItemActives;
