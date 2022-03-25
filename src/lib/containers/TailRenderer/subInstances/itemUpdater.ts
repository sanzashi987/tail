import { RecoilState } from 'recoil';
import type { AtomUpdater, NodeAtom, Node, Edge, EdgeAtom, UpdaterType, IObject } from '@app/types';
import { createNodeAtom } from '@app/atoms/nodes';
import { createEdgeAtom } from '@app/atoms/edges';
import EventEmitter from 'eventemitter3';

abstract class ItemUpdater<T extends { id: string }, A> extends EventEmitter {
  protected itemAtoms: IObject<RecoilState<A>> = {};
  protected lastItems: IObject<T> = {};
  constructor(protected updater: AtomUpdater<A>, items: IObject<T>) {
    super();
    this.diff(items);
    const _on = EventEmitter.prototype.on;
    this.on = function (eventName: string | symbol, listener: (...args: any[]) => void) {
      if (eventName === 'mount') {
        const { lastItems, itemAtoms } = this;
        Object.entries(itemAtoms).forEach(([id, atom]) => {
          listener(lastItems[id], atom);
        });
      }
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
    dirty && this.emit('sizeChange');
    this.lastItems = next;
  }

  private deleteItem(item: T) {
    this.emit('delete', item);
    delete this.itemAtoms[item.id];
  }

  private mountItem(item: T) {
    const atom = this.createAtom(item);
    this.itemAtoms[item.id] = atom;
    this.emit('mount', item, atom);
  }
  private updateItem(lastItem: T, nextItem: T) {
    if (lastItem.id !== nextItem.id) {
      console.error('error input ==>', lastItem, nextItem);
      throw new Error('fail to update the item as their id is different');
    }
    const updater = this.createAtomUpdater(nextItem);
    this.updater(this.itemAtoms[nextItem.id], updater);
    this.emit('update');
  }

  abstract createAtom(item: T): RecoilState<A>;
  abstract createAtomUpdater(item: T): UpdaterType<A>;

  getItemAtoms() {
    return this.itemAtoms;
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
}

// export default ItemUpdater;
