import React, { Component, ReactNode } from 'react';
import type {
  EdgeRendererProps,
  EdgeTree,
  Edge,
  ItemDifferInterface,
  EdgeAtomType,
  IObject,
} from '@lib/types';
import { EdgeInProgress, EdgeWrapper } from '@lib/components/Edge';
import { DifferContext } from '@lib/contexts/differ';
import styles from './index.module.scss';

const EdgeClassname = `tail-edge-container ${styles['edge-container']}`;

class EdgeRenderer extends Component<EdgeRendererProps> {
  static defaultProps = { templates: {} };
  static contextType = DifferContext;
  context!: ItemDifferInterface;

  edgeTree: EdgeTree = new Map();
  edgeInstances: IObject<ReactNode> = {};
  memoEdges: ReactNode;

  componentDidMount() {
    this.context.edgeUpdater.on('mount', this.mountEdge);
    this.context.edgeUpdater.on('delete', this.unmountEdge);
    this.context.edgeUpdater.on('rerender', this.updateMemoEdges);
  }

  mountEdge = (edge: Edge, atom: EdgeAtomType) => {
    const NodeAtoms = this.context.nodeUpdater.getItemAtoms();
    const { id } = edge;
    this.edgeInstances[id] = (
      <EdgeWrapper key={id} nodeAtoms={NodeAtoms} atom={atom} templates={this.props.templates} />
    );
  };

  unmountEdge = (edge: Edge) => {
    delete this.edgeInstances[edge.id];
  };

  updateMemoEdges = () => {
    this.memoEdges = Object.keys(this.edgeInstances).map((k) => this.edgeInstances[k]);
    this.forceUpdate();
  };

  render() {
    return (
      <svg className={EdgeClassname}>
        {this.props.children /*for marker definition */}
        {this.memoEdges}
        <EdgeInProgress template={this.props.connectingEdge} />
      </svg>
    );
  }
}

export default EdgeRenderer;
