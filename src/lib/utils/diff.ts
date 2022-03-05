export function diff<T>(
  last: IObject<T>,
  next: IObject<T>,
  creater: (item: T) => void,
  updater: (last: T, next: T) => void,
  deleter: (item: T) => void,
) {
  let dirty = false;
  const deleted: IObject<T> = { ...last };
  for (const key in next) {
    const val = next[key],
      lastVal = last[key];
    if (lastVal === undefined) {
      !dirty && (dirty = true);
      creater(val);
    } else {
      delete deleted[key];
      if (lastVal !== val) {
        updater(lastVal, val);
      }
    }
  }
  if (!dirty) {
    dirty = Object.keys(deleted).length > 0;
  }
  for (const key in deleted) {
    deleter(deleted[key]);
  }
  return dirty;
}
