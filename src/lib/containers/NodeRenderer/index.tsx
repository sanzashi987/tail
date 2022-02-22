import React, { Component, createRef, ReactNode } from 'react';
import type { Nodes, Node, NodeRendererProps, RecoilNexusInterface, NodeAtomsType } from '@types';
import { createNodeAtom } from '@app/atoms/nodes';
import { NodeWrapper } from '@app/components/Node';
import { RecoilNexus } from '@app/utils';
import { defaultProps, createMemoTemplates } from './utils';

type NodeRendererPropsWithDefaults = NodeRendererProps & typeof defaultProps;

class NodeRenderer extends Component<NodeRendererPropsWithDefaults> {
  static defaultProps = defaultProps;

  // memoTemplates: ReturnType<typeof createMemoTemplates>;

  nodeAtoms: NodeAtomsType = {};
  nodeInstances: IObject<ReactNode> = {};
  memoNodes: ReactNode;

  recoilInterface = createRef<RecoilNexusInterface>();

  constructor(props: NodeRendererPropsWithDefaults) {
    super(props);
    // this.memoTemplates = createMemoTemplates();
    this.diffNodes(props.nodes, {});
  }

  shouldComponentUpdate(nextProps: NodeRendererPropsWithDefaults) {
    if (nextProps.nodes !== this.props.nodes) {
      this.diffNodes(nextProps.nodes, this.props.nodes);
      return true;
    }
    return true;
  }

  componentDidMount() {
    this.props.mounted();
  }

  updateNodesNode = () => {
    this.memoNodes = Object.keys(this.nodeInstances).map((k) => this.nodeInstances[k]);
  };

  diffNodes(nextNodes: Nodes, lastNodes: Nodes) {
    let dirty = false;
    const deleted = { ...lastNodes };
    for (const key in nextNodes) {
      const nextNode = nextNodes[key],
        lastNode = lastNodes[key];
      if (lastNode === undefined) {
        !dirty && (dirty = true);
        this.mountNode(nextNode);
      } else {
        delete deleted[key];
        if (nextNode !== lastNode) {
          this.updateNode(lastNode, nextNode);
        }
      }
    }
    for (const key in deleted) {
      !dirty && (dirty = true);
      this.unmountNode(deleted[key]);
    }
    dirty && this.updateNodesNode();
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
      console.log('error input ==>', lastNode, nextNode);
      throw new Error('fail to update the edge as their id is different');
    }
    this.recoilInterface.current?.setRecoil(this.nodeAtoms[nextNode.id], (prev) => {
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
    return (
      <div className="tail-node-container">
        {this.memoNodes}
        <RecoilNexus ref={this.recoilInterface} />
      </div>
    );
  }
}

export default NodeRenderer;
