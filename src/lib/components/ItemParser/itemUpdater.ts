import type React from 'react';
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
import { registerChild, removeChild, selectItem, unselectItem } from './helpers';

export abstract class ItemUpdater<
  PropsState extends { id: string },
  AtomState,
> extends EventEmitter {
  protected atoms: Record<string, JotaiImmerAtom<AtomState>> = {};
  protected currentItems: Record<string, PropsState> = {};
  constructor(
    public getter: AtomGetter<AtomState>,
    public setter: AtomSetter<AtomState>,
    public activeSet: React.MutableRefObject<Set<string>>,
  ) {
    super();
  }

  on<T extends string | symbol>(event: T, fn: (...args: any[]) => void, context?: any): this {
    if (event === 'mount') {
      const { currentItems: lastItems, atoms: itemAtoms } = this;
      Object.entries(itemAtoms).forEach(([id, atom]) => {
        Promise.resolve().then(() => {
          fn(lastItems[id], atom);
        });
      });
    } else if (event === 'rerender') {
      Promise.resolve().then(() => {
        fn();
      });
    }
    return super.on.call(this, event, fn, context);
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
    this.emit('rerender');
    // requestIdleCallback(() => {});
  }

  protected deleteItem(item: PropsState) {
    this.emit('delete', item);
    delete this.atoms[item.id];
  }

  protected mountItem(item: PropsState) {
    const atom = this.createAtom(item);
    this.atoms[item.id] = atom;
    this.emit('mount', item, atom);
  }

  protected updateItem(lastItem: PropsState, nextItem: PropsState) {
    const updater = this.createAtomUpdater(nextItem);
    this.setter(this.atoms[nextItem.id], updater);
    this.emit('update');
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

  isActive(id: string) {
    return { selected: this.activeSet.current.has(id) };
  }

  abstract createAtom(item: PropsState): JotaiImmerAtom<AtomState>;
  abstract createAtomUpdater(item: PropsState): ImmerUpdater<AtomState>;
}

export class NodeUpdater extends ItemUpdater<Node, NodeAtomState> {
  createAtom(item: Node) {
    return createNodeAtom(item, this.isActive(item.id));
  }
  createAtomUpdater(item: Node) {
    return (prev: NodeAtomState): NodeAtomState => ({ ...prev, node: item });
  }
}

export class EdgeUpdater extends ItemUpdater<Edge, EdgeAtomState> {
  edgeTree: EdgeTree = new Map();

  createAtom(item: Edge) {
    return createEdgeAtom(item, this.isActive(item.id));
  }
  createAtomUpdater(item: Edge) {
    return (prev: EdgeAtomState): EdgeAtomState => ({ ...prev, edge: item });
  }

  protected deleteItem(item: Edge) {
    super.deleteItem(item);
    removeChild(this.edgeTree, item);
  }
  protected mountItem(item: Edge) {
    super.mountItem(item);
    registerChild(this.edgeTree, item);
  }
  protected updateItem(lastItem: Edge, nextItem: Edge) {
    removeChild(this.edgeTree, lastItem);
    registerChild(this.edgeTree, nextItem);
    super.updateItem(lastItem, nextItem);
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
