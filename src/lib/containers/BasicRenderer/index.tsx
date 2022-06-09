import React, { Component, ReactNode } from 'react';
import { DifferContext } from '@lib/contexts/differ';
import type { ItemDifferInterface } from '@lib/types';
//eslint-disable-next-line
class BasicRenderer<T, S = {}> extends Component<T, S> {
  static contextType = DifferContext;
  context!: ItemDifferInterface;

  itemInstances: Record<string, ReactNode> = {};
  memoVNodes: ReactNode;

  updateMemoVNodes = () => {
    this.memoVNodes = <>{Object.keys(this.itemInstances).map((k) => this.itemInstances[k])}</>;
    this.forceUpdate();
  };
}

export default BasicRenderer;
