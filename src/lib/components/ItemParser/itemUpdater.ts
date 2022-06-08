import type { AtomUpdater, NodeAtom, Node, Edge, EdgeAtom, IObject } from '@lib/types';
import { createNodeAtom } from '@lib/atoms/nodes';
import { createEdgeAtom } from '@lib/atoms/edges';
import EventEmitter from 'eventemitter3';
import { ImmerUpdater, JotaiImmerAtom } from '@lib/types/jotai';
import { deleteItem, mountItem, updateItem } from './helpers';

export abstract class ItemUpdater<T extends { id: string }, A> extends EventEmitter {
  protected atoms: IObject<JotaiImmerAtom<A>> = {};
  protected lastItems: IObject<T> = {};
  constructor(protected updater: AtomUpdater<A>, items: IObject<T>) {
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

  diff(next: IObject<T>) {
    let dirty = false;
    const deleted: IObject<T> = { ...this.lastItems };
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
  createAtom(item: Edge) {
    return createEdgeAtom(item);
  }
  createAtomUpdater(item: Edge) {
    return (prev: EdgeAtom): EdgeAtom => ({ ...prev, edge: item });
  }

  protected deleteItem(item: Edge) {
    deleteItem.call(this as any, item);
  }

  protected mountItem(item: Edge) {
    mountItem.call(this as any, item);
  }
  protected updateItem(lastItem: Edge, nextItem: Edge) {
    updateItem.call(this as any, lastItem, nextItem);
  }
}

// export default ItemUpdater;
