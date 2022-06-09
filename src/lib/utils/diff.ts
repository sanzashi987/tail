export function diff<T>(
  last: Record<string, T>,
  next: Record<string, T>,
  creater: (item: T) => void,
  updater: (last: T, next: T) => void,
  deleter: (item: T) => void,
) {
  let dirty = false;
  const deleted: Record<string, T> = { ...last };
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

export function createMemo<T extends Array<any>, S>(func: (...args: T) => S) {
  let lastInput: any[] = [];
  let lastRes: any = null;
  return function wrapper(...args: T) {
    if (args.reduce((last, val, index) => val !== lastInput[index] || last, false)) {
      lastRes = func(...args);
      lastInput = args;
    }
    return lastRes as S;
  };
}
