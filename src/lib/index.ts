import { FC, createElement as h } from 'react';
import StoreRoot from './containers/StoreRoot';
import TailCore from './containers/TailRenderer';
import { TailCoreProps } from './types';

export const Tail: FC<TailCoreProps> = (props) => {
  return h(StoreRoot, {}, [h(TailCore, { ...props, key: 'TailCore' })]);
};
export { default as MiniMap } from './components/MiniMap';
export { drawBezier } from './components/Edge/drawBezier';
export * from './types';
export * from './contexts/differ';
export * from './contexts/instance';
export * from './contexts/store';
export * from './contexts/viewer';
export { default as Handle } from './components/Handle';
export default Tail;

//  { Tail };
