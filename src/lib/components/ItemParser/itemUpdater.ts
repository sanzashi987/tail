import type { NodeAtomState, Node, Edge, EdgeAtomState, EdgeTree } from '@lib/types';
import type {
  AtomGetter,
  AtomSetter,
  ImmerUpdater,
  JotaiImmerAtom,
  UpdaterSetter,
} from '@lib/types/jotai';
import { createNodeAtom } from '@lib/atoms/nodes';
import { createEdgeAtom } from '@lib/atoms/edges';
import EventEmitter from 'eventemitter3';
import {
  deleteItem,
  mountItem,
  registerChild,
  removeChild,
  updateItem,
  selectItem,
  unselectItem,
} from './helpers';

export abstract class ItemUpdater<
  PropsState extends { id: string },
  AtomState
> extends EventEmitter {
  protected atoms: Record<string, JotaiImmerAtom<AtomState>> = {};
  protected currentItems: Record<string, PropsState> = {};
  constructor(public getter: AtomGetter<AtomState>, public setter: AtomSetter<AtomState>) {
    super();
    const { on: _on } = EventEmitter.prototype;
    this.on = function (eventName: string | symbol, listener: (...args: any[]) => void) {
      if (eventName === 'mount') {
        const { currentItems: lastItems, atoms: itemAtoms } = this;
        Object.entries(itemAtoms).forEach(([id, atom]) => {
          requestIdleCallback(() => {
            listener(lastItems[id], atom);
          });
        });
      } else if (eventName === 'rerender') {
        requestIdleCallback(() => {
          listener();
        });
      }
      _on.call(this, eventName, listener);
      return this;
    };
  }

  diff(next: Record<string, PropsState>) {
    let dirty = false;
    const deleted = { ...this.currentItems };
    const last = { ...this.currentItems };
    for (const key in next) {
      const val = next[key],
        lastVal = last[key];
      if (lastVal === undefined) {
        !dirty && (dirty = true);
        this.mountItem(val);
      } else {
        delete deleted[key];
        if (lastVal !== val) {
          this.updateItem(lastVal, val);
        }
      }
    }
    if (!dirty) {
      dirty = Object.keys(deleted).length > 0;
    }
    for (const key in deleted) {
      this.deleteItem(deleted[key]);
    }
    dirty && this.rerender();
    this.currentItems = next;
  }

  private rerender() {
    requestIdleCallback(() => {
      this.emit('rerender');
    });
  }

  protected deleteItem(item: PropsState) {
    deleteItem.call(this as any, item);
  }

  protected mountItem(item: PropsState) {
    mountItem.call(this as any, item);
  }

  protected updateItem(lastItem: PropsState, nextItem: PropsState) {
    updateItem.call(this as any, lastItem, nextItem);
  }

  getState = (id: string): AtomState | null => {
    const atom = this.atoms[id];
    if (!atom) return null;
    return this.getter(atom);
  };

  setState = (id: string, updater: ImmerUpdater<AtomState>) => {
    const atom = this.atoms[id];
    if (!atom) return null;
    this.setter(atom, updater);
  };

  getAtoms() {
    return this.atoms;
  }

  abstract createAtom(item: PropsState): JotaiImmerAtom<AtomState>;
  abstract createAtomUpdater(item: PropsState): ImmerUpdater<AtomState>;
}

export class NodeUpdater extends ItemUpdater<Node, NodeAtomState> {
  createAtom(item: Node) {
    return createNodeAtom(item);
  }
  createAtomUpdater(item: Node) {
    return (prev: NodeAtomState): NodeAtomState => ({ ...prev, node: item });
  }
}

export class EdgeUpdater extends ItemUpdater<Edge, EdgeAtomState> {
  edgeTree: EdgeTree = new Map();

  createAtom(item: Edge) {
    return createEdgeAtom(item);
  }
  createAtomUpdater(item: Edge) {
    return (prev: EdgeAtomState): EdgeAtomState => ({ ...prev, edge: item });
  }

  protected deleteItem(item: Edge) {
    deleteItem.call(this as any, item);
    removeChild(this.edgeTree, item);
  }
  protected mountItem(item: Edge) {
    mountItem.call(this as any, item);
    registerChild(this.edgeTree, item);
  }
  protected updateItem(lastItem: Edge, nextItem: Edge) {
    removeChild(this.edgeTree, lastItem);
    registerChild(this.edgeTree, nextItem);
    updateItem.call(this as any, lastItem, nextItem);
  }
}

export class ItemSelector<AtomState> {
  currentItems: string[] = [];
  constructor(private setter: UpdaterSetter<AtomState>) {}

  diff(next: string[]) {
    const deleted = new Set(this.currentItems);
    for (const val of next) {
      if (!deleted.has(val)) {
        this.setter(val, selectItem);
      } else {
        deleted.delete(val);
      }
    }
    deleted.forEach((val) => {
      this.setter(val, unselectItem);
    });

    this.currentItems = next;
  }
}
