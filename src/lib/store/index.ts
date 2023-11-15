import { createStore } from 'jotai';

export const tailStore = createStore();

export const atomGetter = tailStore.get;
export const atomSetter = tailStore.set;
