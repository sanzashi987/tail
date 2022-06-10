import type { NodeAtom, Node, Edge, EdgeAtom, EdgeTree } from '@lib/types';
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
  AtomState,
> extends EventEmitter {
  protected atoms: Record<string, JotaiImmerAtom<AtomState>> = {};
  protected lastItems: Record<string, PropsState> = {};
  constructor(protected getter: AtomGetter<AtomState>, protected setter: AtomSetter<AtomState>) {
    super();
    // this.diff(items);
    const { on: _on } = EventEmitter.prototype;
    this.on = function (eventName: string | symbol, listener: (...args: any[]) => void) {
      if (eventName === 'mount') {
        const { lastItems, atoms: itemAtoms } = this;
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
    const deleted = { ...this.lastItems };
    const last = { ...this.lastItems };
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
    this.lastItems = next;
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

export class NodeUpdater extends ItemUpdater<Node, NodeAtom> {
  createAtom(item: Node) {
    return createNodeAtom(item);
  }
  createAtomUpdater(item: Node) {
    return (prev: NodeAtom): NodeAtom => ({ ...prev, node: item });
  }
}

export class EdgeUpdater extends ItemUpdater<Edge, EdgeAtom> {
  edgeTree: EdgeTree = new Map();

  createAtom(item: Edge) {
    return createEdgeAtom(item);
  }
  createAtomUpdater(item: Edge) {
    return (prev: EdgeAtom): EdgeAtom => ({ ...prev, edge: item });
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
  lastItems: string[] = [];
  constructor(private setter: UpdaterSetter<AtomState>) {}

  diff(next: string[]) {
    const deleted = new Set(this.lastItems);
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

    this.lastItems = next;
  }
}
