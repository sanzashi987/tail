import React, { Component, ReactNode } from 'react';
import { ParserContext } from '@lib/contexts/parser';
import type { ItemParserInterface } from '@lib/types';
//eslint-disable-next-line
class BasicRenderer<T, S = {}> extends Component<T, S> {
  static contextType = ParserContext;
  declare context: ItemParserInterface;

  itemInstances: Record<string, ReactNode> = {};
  memoVNodes: ReactNode;

  updateMemoVNodes = () => {
    this.memoVNodes = <>{Object.keys(this.itemInstances).map((k) => this.itemInstances[k])}</>;
    this.forceUpdate();
  };
}

export default BasicRenderer;
