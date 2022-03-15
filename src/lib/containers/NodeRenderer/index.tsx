import React, { Component, ReactNode } from 'react';
import type { Nodes, Node, NodeRendererProps, NodeAtomsType } from '@types';
import { createNodeAtom } from '@app/atoms/nodes';
import { NodeWrapper } from '@app/components/Node';
import { diff } from '@app/utils';
import { createMemoTemplates, defaultProps } from './utils';

class NodeRenderer extends Component<NodeRendererProps> {
  // memoTemplates: ReturnType<typeof createMemoTemplates>;
  static defaultProps = defaultProps;
  nodeAtoms: NodeAtomsType = {};
  nodeInstances: IObject<ReactNode> = {};
  memoNodes: ReactNode;

  constructor(props: NodeRendererProps) {
    super(props);
    // this.memoTemplates = createMemoTemplates();
    this.diffNodes({}, props.nodes);
  }

  shouldComponentUpdate(nextProps: NodeRendererProps) {
    if (nextProps.nodes !== this.props.nodes) {
      this.diffNodes(this.props.nodes, nextProps.nodes);
      return true;
    }
    return true;
  }

  componentDidMount() {
    this.props.mounted();
  }

  diffNodes(lastNodes: Nodes, nextNodes: Nodes) {
    const { mountNode, updateNode, unmountNode } = this;
    const dirty = diff(lastNodes, nextNodes, mountNode, updateNode, unmountNode);
    if (!dirty) return;
    this.memoNodes = Object.keys(this.nodeInstances).map((k) => this.nodeInstances[k]);
  }

  mountNode = (node: Node) => {
    const { id } = node;
    this.nodeAtoms[id] = createNodeAtom(node);
    const { templatePicker, templates } = this.props;
    this.nodeInstances[id] = (
      <NodeWrapper
        key={id}
        atom={this.nodeAtoms[id]}
        templates={templates}
        templatePicker={templatePicker}
      />
    );
  };

  updateNode = (lastNode: Node, nextNode: Node) => {
    if (lastNode.id !== nextNode.id) {
      console.error('error input ==>', lastNode, nextNode);
      throw new Error('fail to update the edge as their id is different');
    }
    this.props.storeUpdater(this.nodeAtoms[nextNode.id], (prev) => {
      return {
        ...prev,
        node: nextNode,
      };
    });
  };

  unmountNode = (node: Node) => {
    delete this.nodeInstances[node.id];
    delete this.nodeAtoms[node.id];
  };

  render() {
    return <div className="tail-node-container select-none">{this.memoNodes}</div>;
  }
}

export default NodeRenderer;
