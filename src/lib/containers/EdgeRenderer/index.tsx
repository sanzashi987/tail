import React, { Component, ReactNode } from 'react';
import type { EdgeRendererProps, EdgeAtomsType, EdgeTree, Edge } from '@types';
import { EdgeInProgress, BasicEdge, EdgeWrapper, BasicShadow } from '@app/components/Edge';
import { createEdgeAtom } from '@app/atoms/edges';
import { diff } from '@app/utils';
import styles from './index.module.scss';
import { registerChild, removeChild, defaultProps } from './utils';

type Edges = EdgeRendererProps['edges'];
class EdgeRenderer extends Component<EdgeRendererProps> {
  static defaultProps = defaultProps;

  edgeTree: EdgeTree = new Map();
  edgeInstances: IObject<ReactNode> = {};
  edgeAtoms: EdgeAtomsType = {};
  memoEdges: ReactNode;

  constructor(props: EdgeRendererProps) {
    super(props);
    this.diffEdges({}, props.edges);
  }

  shouldComponentUpdate(nextProps: EdgeRendererProps) {
    if (nextProps.edges !== this.props.edges) {
      this.diffEdges(this.props.edges, nextProps.edges);
      return true;
    }
    return true;
  }

  diffEdges(lastEdges: Edges, nextEdges: Edges) {
    const { mountEdge, updateEdge, unmountEdge } = this;
    const dirty = diff(lastEdges, nextEdges, mountEdge, updateEdge, unmountEdge);
    if (!dirty) return;
    this.memoEdges = Object.keys(this.edgeInstances).map((k) => this.edgeInstances[k]);
  }

  updateEdge = (lastEdge: Edge, nextEdge: Edge) => {
    if (lastEdge.id !== nextEdge.id) {
      console.error('error input ==>', lastEdge, nextEdge);
      throw new Error('fail to update the edge as their id is different');
    }
    removeChild(this.edgeTree, lastEdge);
    registerChild(this.edgeTree, nextEdge);
    this.props.storeUpdater(this.edgeAtoms[nextEdge.id], (prev) => {
      return {
        ...prev,
        edge: nextEdge,
      };
    });
  };

  mountEdge = (edge: Edge) => {
    const { type = '', id } = edge;
    this.edgeAtoms[id] = createEdgeAtom(edge);
    registerChild(this.edgeTree, edge);
    const EdgeComponent = this.props.templates[type]?.default ?? BasicEdge;
    const ShadowComponent = this.props.templates[type]?.shadow ?? BasicShadow;
    const NodeAtoms = this.props.getNodeAtoms();
    this.edgeInstances[id] = (
      <EdgeWrapper
        key={id}
        nodeAtoms={NodeAtoms}
        atom={this.edgeAtoms[id]}
        template={EdgeComponent}
        shadow={ShadowComponent}
      />
    );
  };

  unmountEdge = (edge: Edge) => {
    removeChild(this.edgeTree, edge);
    delete this.edgeInstances[edge.id];
    delete this.edgeAtoms[edge.id];
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
