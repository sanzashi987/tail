import { useCallback } from 'react';
import { ImmerUpdater, JotaiImmerAtom } from '@lib/types/jotai';
import { useAtomCallback } from 'jotai/utils';

export function useAtomSetter() {
  const atomSetter = useAtomCallback<void, any>(
    useCallback((get, set, arg) => set(arg.atom, arg.updater), []),
  );
  return useCallback(<T>(atom: JotaiImmerAtom<T>, updater: ImmerUpdater<T>) => {
    atomSetter({ atom, updater });
  }, []);
}

export function useAtomGetter() {
  const atomGetter = useAtomCallback<any, any>(useCallback((get, set, arg) => get(arg), []));
  return useCallback(<T>(atom: JotaiImmerAtom<T>) => {
    return atomGetter(atom) as unknown as T;
  }, []);
}
