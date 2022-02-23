import type { SelectedItemType, EdgeAtom, NodeAtom, EdgeInProgressAtomType } from '@app/types';
import type { RecoilState } from 'recoil';
import TailCore from '.';

export function getAtom<T>(id: string, atomPool?: IObject<RecoilState<T>>) {
  const atom = atomPool?.[id];
  if (!atom) throw Error('fail to fetch atom from the pool');
  return atom;
}

export function immutableSelectedHandles(prev: NodeAtom) {
  const next = { ...prev };
  next.selectedHandles = { ...next.selectedHandles };
  return next;
}

export function deactivateHandle(next: NodeAtom, handleId: string) {
  const linked = next.selectedHandles[handleId];
  if (linked === 1) {
    delete next.selectedHandles[handleId];
  } else {
    next.selectedHandles[handleId] = linked - 1;
  }
}

export function activateHandle(next: NodeAtom, handleId: string) {
  const linked = next.selectedHandles[handleId];
  next.selectedHandles[handleId] = typeof linked === 'number' && linked === linked ? linked + 1 : 1;
}

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

export function setSelectedHandle(
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

export function switchActive(_this: TailCore, type: SelectedItemType, id: string, active: boolean) {
  const atom = _this.getAtom(type, id);
  _this.Set(atom as RecoilState<NodeAtom | EdgeAtom>, (prev) => {
    const next = { ...prev };
    next.selected = active;
    return next;
  });
  if (type !== 'edge') return;
  const cb = active ? activateHandle : deactivateHandle;
  const {
    edge: { sourceNode, target, targetNode, source },
  } = _this.Get(atom as RecoilState<EdgeAtom>)!;
  const pool = _this.nodeRef.current?.nodeAtoms;
  setSelectedHandle(sourceNode, source, pool, cb, _this.Set);
  setSelectedHandle(targetNode, target, pool, cb, _this.Set);
}
