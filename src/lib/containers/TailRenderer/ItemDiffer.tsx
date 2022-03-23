import React, { Component } from 'react';
import { DifferProvider } from '@app/contexts/differ';
import type { ItemDifferProps, ItemDifferInterface } from '@app/types';
import { EdgeUpdater, NodeUpdater } from './subInstances/itemUpdater';

class ItemDiffer extends Component<ItemDifferProps> {
  differInterface: ItemDifferInterface;

  constructor(props: ItemDifferProps) {
    super(props);
    const { nodes, atomSetter, edges } = props;
    this.differInterface = {
      nodeUpdater: new NodeUpdater(atomSetter, nodes),
      edgeUpdater: new EdgeUpdater(atomSetter, edges),
    };
  }

  componentDidUpdate(lastProps: ItemDifferProps) {
    const { nodeUpdater, edgeUpdater } = this.differInterface;
    const { nodes, edges } = this.props;
    if (nodes !== lastProps.nodes) {
      nodeUpdater.diff(nodes);
    }
    if (edges !== lastProps.edges) {
      edgeUpdater.diff(edges);
    }
  }

  render() {
    return <DifferProvider value={this.differInterface}>{this.props.children}</DifferProvider>;
  }
}

export default ItemDiffer;
