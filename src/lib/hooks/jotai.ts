import { useCallback } from 'react';
import { ImmerUpdater, JotaiImmerAtom } from '@lib/types/jotai';
import { useAtomCallback } from 'jotai/utils';

export function useAtomSetter() {
  const atomSetter = useAtomCallback(
    useCallback(
      (get, set) =>
        <T>(atom: JotaiImmerAtom<T>, updater: ImmerUpdater<T>) => {
          set(atom, updater);
        },
      [],
    ),
  );
  return atomSetter;
}
export function useAtomGetter() {
  const atomGetter = useAtomCallback(
    useCallback(
      (get) =>
        <T>(atom: JotaiImmerAtom<T>) =>
          get(atom),
      [],
    ),
  );
  return atomGetter;
}
