import React from 'react';
import type { Node, NodeRendererProps, NodeAtom } from '@lib/types';
import { NodeWrapper } from '@lib/components/Node';
import { defaultProps } from './utils';
import BasicRenderer from '../BasicRenderer';

class NodeRenderer extends BasicRenderer<NodeRendererProps> {
  static defaultProps = defaultProps;
  componentDidMount() {
    this.context.nodeUpdater.on('mount', this.mountNode);
    this.context.nodeUpdater.on('delete', this.unmountNode);
    this.context.nodeUpdater.on('rerender', this.updateMemoVNodes);
  }

  componentWillUnmount(): void {
    this.context.nodeUpdater.off('mount', this.mountNode);
    this.context.nodeUpdater.off('delete', this.unmountNode);
    this.context.nodeUpdater.off('rerender', this.updateMemoVNodes);
  }

  mountNode = (node: Node, atom: NodeAtom) => {
    const { id } = node;
    const { templatePicker, templates } = this.props;
    this.itemInstances[id] = (
      <NodeWrapper key={id} atom={atom} templates={templates} templatePicker={templatePicker} />
    );
  };

  unmountNode = (node: Node) => {
    delete this.itemInstances[node.id];
  };

  render() {
    return <div className="tail-node-container select-none">{this.memoVNodes}</div>;
  }
}

export default NodeRenderer;
