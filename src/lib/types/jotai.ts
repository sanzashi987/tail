import { WritableAtom } from 'jotai';
import type { Draft } from 'immer';

export type JotaiImmerAtom<Value> = WritableAtom<Value, Value | ((draft: Draft<Value>) => void)>;
