export * from './nodes';
export * from './edges';
export * from './handles';
export * from './dragger';
export * from './instance';
export * from './viewer';
export * from './minimap';

export type IObject<T = any> = {
  [k: string]: T;
};
