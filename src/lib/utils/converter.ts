/* eslint-disable @typescript-eslint/ban-types */
import { useMemo } from 'react';

export const useArrayKeysObject = <T extends {} = {}>(arr: T[], key: keyof T) => {
  //eslint-disable-line
  const object = useMemo(() => {
    const res: Record<string, T> = {};
    arr.forEach((item) => {
      res[item[key] as any] = item;
    });
    return res;
  }, [arr, key]);
  return object;
};

// export const useObjectValuesArray = <T extends {} = {}>(obj: Record<string,T>) => {};

export function noop() {
  return;
}
