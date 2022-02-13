export function diff<T>(curr: IObject<T>, last: IObject<T>) {
  const updated: IObject<T> = {}
  const deleted: IObject<T> = { ...last }
  const created: IObject<T> = {}
  for (const key in curr) {
    const val = curr[key], lastVal = last[key]
    if (lastVal === undefined) {
      created[key] = val
    } else {
      delete deleted[key]
      if (lastVal !== val) {
        updated[key] = val
      }
    }
  }
}