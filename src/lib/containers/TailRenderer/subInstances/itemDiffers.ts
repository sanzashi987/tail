import EventEmitter from 'events';

class ItemDiffers<T> extends EventEmitter {
  private ready = false;
  private lastItems: IObject<T>;
  constructor(items: IObject<T>) {
    super();
    this.lastItems = items;
  }

  private diff(next: IObject<T>) {
    let dirty = false;
    const deleted: IObject<T> = { ...this.lastItems };
    const last = { ...this.lastItems };
    this.lastItems = next;
    if (!this.ready) return;
    for (const key in next) {
      const val = next[key],
        lastVal = last[key];
      if (lastVal === undefined) {
        !dirty && (dirty = true);
        this.emit('create', val);
      } else {
        delete deleted[key];
        if (lastVal !== val) {
          this.emit('update', lastVal, val);
        }
      }
    }
    if (!dirty) {
      dirty = Object.keys(deleted).length > 0;
    }
    for (const key in deleted) {
      this.emit('delete', deleted[key]);
    }
    dirty && this.emit('sizeChange');
  }

  start() {
    this.ready = true;
    const next = this.lastItems;
    this.lastItems = {};
    this.diff(next);
  }
}

export default ItemDiffers;
