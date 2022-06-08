import React, { Component, ReactNode } from 'react';
import type {
  Node,
  NodeRendererProps,
  ItemDifferInterface,
  NodeAtomType,
  IObject,
} from '@lib/types';
import { NodeWrapper } from '@lib/components/Node';
import { DifferContext } from '@lib/contexts/differ';
import { defaultProps } from './utils';

class NodeRenderer extends Component<NodeRendererProps> {
  static defaultProps = defaultProps;
  static contextType = DifferContext;
  context!: ItemDifferInterface;

  nodeInstances: IObject<ReactNode> = {};
  memoNodes: ReactNode;

  componentDidMount() {
    this.context.nodeUpdater.on('mount', this.mountNode);
    this.context.nodeUpdater.on('delete', this.unmountNode);
    this.context.nodeUpdater.on('rerender', this.updateMemoNodes);
  }

  mountNode = (node: Node, atom: NodeAtomType) => {
    const { id } = node;
    const { templatePicker, templates } = this.props;
    this.nodeInstances[id] = (
      <NodeWrapper key={id} atom={atom} templates={templates} templatePicker={templatePicker} />
    );
  };

  updateNode = () => {
    return;
  };

  unmountNode = (node: Node) => {
    delete this.nodeInstances[node.id];
  };

  updateMemoNodes = () => {
    this.memoNodes = Object.keys(this.nodeInstances).map((k) => this.nodeInstances[k]);
    this.forceUpdate();
  };

  render() {
    return <div className="tail-node-container select-none">{this.memoNodes}</div>;
  }
}

export default NodeRenderer;
