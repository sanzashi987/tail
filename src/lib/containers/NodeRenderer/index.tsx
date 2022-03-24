import React, { Component, ReactNode } from 'react';
import type { Node, NodeRendererProps, ItemDifferInterface, NodeAtomType } from '@types';
import { NodeWrapper } from '@app/components/Node';
import { DifferContext } from '@app/contexts/differ';
import { createMemoTemplates, defaultProps } from './utils';

class NodeRenderer extends Component<NodeRendererProps> {
  // memoTemplates: ReturnType<typeof createMemoTemplates>;
  static defaultProps = defaultProps;
  static contextType = DifferContext;
  context!: ItemDifferInterface;

  nodeInstances: IObject<ReactNode> = {};
  memoNodes: ReactNode;

  componentDidMount() {
    this.context.nodeUpdater.on('mount', this.mountNode);
    this.context.nodeUpdater.on('delete', this.unmountNode);
    this.context.nodeUpdater.on('sizeChange', this.updateMemoNodes);
    this.updateMemoNodes();
  }

  mountNode = (node: Node, atom: NodeAtomType) => {
    const { id } = node;
    const { templatePicker, templates } = this.props;
    this.nodeInstances[id] = (
      <NodeWrapper key={id} atom={atom} templates={templates} templatePicker={templatePicker} />
    );
  };

  updateNode = (lastNode: Node, nextNode: Node) => {
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
