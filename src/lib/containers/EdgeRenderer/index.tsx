import React, { Component, ReactNode } from 'react';
import type { EdgeRendererProps, EdgeTree, Edge, ItemDifferInterface, EdgeAtomType } from '@types';
import { EdgeInProgress, BasicEdge, EdgeWrapper } from '@app/components/Edge';
import { DifferContext } from '@app/contexts/differ';
import styles from './index.module.scss';
import { registerChild, removeChild, defaultProps } from './utils';

class EdgeRenderer extends Component<EdgeRendererProps> {
  static defaultProps = defaultProps;
  static contextType = DifferContext;
  context!: ItemDifferInterface;

  edgeTree: EdgeTree = new Map();
  edgeInstances: IObject<ReactNode> = {};
  memoEdges: ReactNode;

  componentDidMount() {
    this.context.edgeUpdater.on('mount', this.mountEdge);
    this.context.edgeUpdater.on('delete', this.unmountEdge);
    this.context.edgeUpdater.on('sizeChange', this.updateMemoEdges);
    this.updateMemoEdges();
  }

  updateEdge = (lastEdge: Edge, nextEdge: Edge) => {
    removeChild(this.edgeTree, lastEdge);
    registerChild(this.edgeTree, nextEdge);
  };

  mountEdge = (edge: Edge, atom: EdgeAtomType) => {
    const NodeAtoms = this.context.nodeUpdater.getItemAtoms();
    const { id } = edge;
    registerChild(this.edgeTree, edge);
    this.edgeInstances[id] = (
      <EdgeWrapper
        key={id}
        nodeAtoms={NodeAtoms}
        atom={atom}
        templates={this.props.templates}
        updateEdge={this.updateEdge}
      />
    );
  };

  unmountEdge = (edge: Edge) => {
    removeChild(this.edgeTree, edge);
    delete this.edgeInstances[edge.id];
  };

  updateMemoEdges = () => {
    this.memoEdges = Object.keys(this.edgeInstances).map((k) => this.edgeInstances[k]);
    this.forceUpdate();
  };

  render() {
    return (
      <svg className={`tail-edge-container ${styles['edge-container']}`}>
        {this.props.children /*for marker definition */}
        {this.memoEdges}
        <EdgeInProgress template={BasicEdge as any} />
      </svg>
    );
  }
}

export default EdgeRenderer;
