import { WritableAtom } from 'jotai';
import type { Draft } from 'immer';

export type JotaiImmerAtom<Value> = WritableAtom<Value, ImmerUpdater<Value>>;
export type ImmerUpdater<Value> = Value | ((draft: Draft<Value>) => void);
