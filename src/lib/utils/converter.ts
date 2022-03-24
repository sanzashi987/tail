/* eslint-disable @typescript-eslint/ban-types */
import { useMemo } from 'react';
import type { IObject } from '@app/types';

export const useArrayKeysObject = <T extends {} = {}>(arr: T[], key: keyof T) => {
  //eslint-disable-line
  const object = useMemo(() => {
    const res: IObject<T> = {};
    arr.forEach((item) => {
      res[item[key] as any] = item;
    });
    return res;
  }, [arr, key]);
  return object;
};

// export const useObjectValuesArray = <T extends {} = {}>(obj: IObject<T>) => {};

export function noop() {
  return;
}
