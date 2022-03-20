export function binarySearch(sortedArr: number[], val: number) {
  let minIndex = 0,
    maxIndex = sortedArr.length;

  while (minIndex < maxIndex) {
    const mid = (minIndex + maxIndex) >>> 1; // right shift avoid decimal
    if (sortedArr[minIndex] < val) minIndex = mid + 1;
    else maxIndex = mid;
  }
  return minIndex;
}

// mutatably
export function binaryInsert(sortedArr: number[], val: number) {
  const index = binarySearch(sortedArr, val);
  sortedArr.splice(index, 0, val);
}

export function binaryDelete(sortedArr: number[], val: number) {
  const index = binarySearch(sortedArr, val);
  sortedArr.splice(index, 1);
}
