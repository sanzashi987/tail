import React, { Component, ReactNode, createRef } from 'react';
import type {
  EdgeRendererProps,
  EdgeAtomsType,
  EdgeAtom,
  EdgeTree,
  Edge,
  RecoilNexusInterface,
} from '@types';
import { EdgeInProgress, BasicEdge, EdgeWrapper } from '@app/components/Edge';

import { createEdgeAtom } from '@app/atoms/edges';
import { RecoilNexus } from '@app/utils';
import { registerChild, removeChild } from './utils';

type Edges = EdgeRendererProps['edges'];

const defaultProps = { templates: {} };

type EdgeRendererPropsWithDefaults = EdgeRendererProps & typeof defaultProps;

class EdgeRenderer extends Component<EdgeRendererPropsWithDefaults> {
  static defaultProps = defaultProps;

  edgeTree: EdgeTree = new Map();
  edgeInstances: IObject<ReactNode> = {};
  edgeAtoms: EdgeAtomsType = {};

  memoEdges: ReactNode;
  recoilInterface = createRef<RecoilNexusInterface>();

  constructor(props: EdgeRendererPropsWithDefaults) {
    super(props);
    this.diffEdges(props.edges, {});
  }

  shouldComponentUpdate(nextProps: EdgeRendererProps) {
    if (nextProps.edges !== this.props.edges) {
      this.diffEdges(nextProps.edges, this.props.edges);
      return true;
    }
    return true;
  }

  updateEdgesNode() {
    this.memoEdges = Object.keys(this.edgeInstances).map((k) => this.edgeInstances[k]);
  }

  diffEdges(nextEdges: Edges, lastEdges: Edges) {
    let dirty = false;
    const deleted = { ...lastEdges };
    for (const key in nextEdges) {
      const val = nextEdges[key],
        lastVal = lastEdges[key];
      if (lastVal === undefined) {
        !dirty && (dirty = true);
        this.mountEdge(val);
      } else {
        delete deleted[key];
        if (lastVal !== val) {
          this.updateEdge(lastVal, val);
        }
      }
    }
    for (const key in deleted) {
      !dirty && (dirty = true);
      this.unmountEdge(deleted[key]);
    }
    dirty && this.updateEdgesNode();
  }

  updateEdge = (lastEdge: Edge, nextEdge: Edge) => {
    if (lastEdge.id !== nextEdge.id) {
      console.log('error input ==>', lastEdge, nextEdge);
      throw new Error('fail to update the edge as their id is different');
    }
    removeChild(this.edgeTree, lastEdge);
    registerChild(this.edgeTree, nextEdge);
    this.recoilInterface.current?.set(this.edgeAtoms[nextEdge.id], (prev) => {
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
    const EdgeComponent = this.props.templates[type] ?? BasicEdge;
    const NodeAtoms = this.props.getNodeAtoms();
    this.edgeInstances[id] = (
      <EdgeWrapper
        key={id}
        nodeAtoms={NodeAtoms}
        atom={this.edgeAtoms[id]}
        template={EdgeComponent}
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
      <svg className="tail-edge-container">
        <RecoilNexus ref={this.recoilInterface} />
        {this.props.children /*for marker definition */}
        {this.memoEdges}
        {<EdgeInProgress />}
      </svg>
    );
  }
}

export default EdgeRenderer;
