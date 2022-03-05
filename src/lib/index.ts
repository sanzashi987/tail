import { FC, createElement as h } from 'react';
import StoreRoot from './containers/StoreRoot';
import TailCore from './containers/TailRenderer';
import { TailCoreProps } from './types';

const Tail: FC<TailCoreProps> = (props) => {
  return h(StoreRoot, {}, [h(TailCore, props)]);
};

export { Tail };
