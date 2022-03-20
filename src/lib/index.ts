import { FC, createElement as h } from 'react';
import StoreRoot from './containers/StoreRoot';
import TailCore from './containers/TailRenderer';
import { TailCoreProps } from './types';

export const Tail: FC<TailCoreProps> = (props) => {
  return h(StoreRoot, {}, [h(TailCore, { ...props, key: 'TailCore' })]);
};

export { default as MiniMap } from './components/MiniMap';

//  { Tail };
