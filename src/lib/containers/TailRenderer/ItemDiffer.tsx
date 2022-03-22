import React, { Component } from 'react';
import { DifferProvider } from '@app/contexts/differ';
import { ItemDifferProps } from '@app/types';
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

  componentDidUpdate(lastProps:ItemDifferProps) {
    
  }


  render() {
    return <DifferProvider value={this.differInterface}>{this.props.children}</DifferProvider>;
  }
}

export default ItemDiffer;
