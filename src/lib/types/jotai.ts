import type { useAtomCallback } from 'jotai/utils';
import type { WritableAtom } from 'jotai';
import type { Draft } from 'immer';

export type JotaiImmerAtom<Value> = WritableAtom<Value, ImmerUpdater<Value>>;
export type ImmerUpdater<Value> = Value | ((draft: Draft<Value>) => void);
export type AtomGetter<T> = (atom: JotaiImmerAtom<T>) => T;
export type AtomSetter<T> = (atom: JotaiImmerAtom<T>, updater: ImmerUpdater<T>) => void;
export type AtomCallback = Parameters<Parameters<typeof useAtomCallback>[0]>;
export type WriteGetter = AtomCallback[0];
export type Setter = AtomCallback[1];
export type UpdaterSetter<T> = (id: string, updater: ImmerUpdater<T>) => null | void;
export type AtomForceRender = {
  forceRender: number;
};
