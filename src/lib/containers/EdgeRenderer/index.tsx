import React, { Component, ReactNode, createRef } from 'react';
import type { EdgeRendererProps, EdgeAtom, EdgeTree, Edge, RecoilNexusInterface } from '@types';
import { EdgeInProgress, BasicEdge } from '@app/components/Edge';
import { registerChild, removeChild } from './utils';
import type { RecoilState } from 'recoil';
import { createEdgeAtom } from '@app/atoms/edges';
import { RecoilNexus } from '@app/utils';

type Edges = EdgeRendererProps['edges'];
class EdgeRenderer extends Component<EdgeRendererProps> {
  edgeTree: EdgeTree = new Map();
  edgeInstances: IObject<ReactNode> = {};
  edgeAtoms: IObject<RecoilState<EdgeAtom>> = {};

  memoEdges: ReactNode;
  recoilInterface = createRef<RecoilNexusInterface>();

  constructor(props: EdgeRendererProps) {
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
    const EdgeWrapper = this.props.templates?.[type] ?? BasicEdge;
    this.edgeInstances[id] = <EdgeWrapper atom={this.edgeAtoms[id]} key={id} />;
  };

  unmountEdge = (edge: Edge) => {
    removeChild(this.edgeTree, edge);
    delete this.edgeInstances[edge.id];
    delete this.edgeAtoms[edge.id];
  };

  render() {
    const { connecting } = this.props;
    return (
      <svg className="tail-edge-container">
        <RecoilNexus ref={this.recoilInterface} />
        {this.props.children /*for marker definition */}
        {this.memoEdges}
        {connecting && <EdgeInProgress />}
      </svg>
    );
  }
}

export default EdgeRenderer;
