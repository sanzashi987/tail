import type { NodeAtom, Node, Edge, EdgeAtom, EdgeTree } from '@lib/types';
import type { AtomGetter, AtomSetter, ImmerUpdater, JotaiImmerAtom } from '@lib/types/jotai';
import { createNodeAtom } from '@lib/atoms/nodes';
import { createEdgeAtom } from '@lib/atoms/edges';
import EventEmitter from 'eventemitter3';
import { deleteItem, mountItem, registerChild, removeChild, updateItem } from './helpers';

export abstract class ItemUpdater<T extends { id: string }, A> extends EventEmitter {
  protected atoms: Record<string, JotaiImmerAtom<A>> = {};
  protected lastItems: Record<string, T> = {};
  constructor(
    protected getter: AtomGetter<A>,
    protected setter: AtomSetter<A>,
    items: Record<string, T>,
  ) {
    super();
    this.diff(items);
    const _on = EventEmitter.prototype.on;
    this.on = function (eventName: string | symbol, listener: (...args: any[]) => void) {
      if (eventName === 'mount') {
        const { lastItems, atoms: itemAtoms } = this;
        Object.entries(itemAtoms).forEach(([id, atom]) => {
          requestIdleCallback(() => {
            listener(lastItems[id], atom);
          });
        });
      }
      this.rerender();
      _on.call(this, eventName, listener);
      return this;
    };
  }

  diff(next: Record<string, T>) {
    let dirty = false;
    const deleted: Record<string, T> = { ...this.lastItems };
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

  protected deleteItem(item: T) {
    deleteItem.call(this as any, item);
  }

  protected mountItem(item: T) {
    mountItem.call(this as any, item);
  }
  protected updateItem(lastItem: T, nextItem: T) {
    updateItem.call(this as any, lastItem, nextItem);
  }

  abstract createAtom(item: T): JotaiImmerAtom<A>;
  abstract createAtomUpdater(item: T): ImmerUpdater<A>;

  getItemAtoms() {
    return this.atoms;
  }
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
