import React, { Component, ReactNode } from 'react';
import type { EdgeRendererProps, EdgeAtom, EdgeTree, Edge } from '@types'
import { EdgeInProgress, BasicEdge } from '@app/components/Edge'
import { registerChild, removeChild } from './utils'
import type { RecoilState } from 'recoil'
import { createEdgeAtom } from '@app/atoms/edges';

type Edges = EdgeRendererProps['edges']
class EdgeRenderer extends Component<EdgeRendererProps> {

  edgeTree: EdgeTree = new Map()
  edgeInstances: IObject<ReactNode> = {}
  edgeAtoms: IObject<RecoilState<EdgeAtom>> = {}

  memoEdges: ReactNode

  constructor(props: EdgeRendererProps) {
    super(props)
    this.parseEdges(props.edges)
  }

  parseEdges(edges: Edges) {
    Object.keys(edges).forEach(key => {
      this.mountEdge(edges[key])
    })
    this.updateEdgesNode()
  }

  shouldComponentUpdate(nextProps: EdgeRendererProps) {
    if (nextProps.edges !== this.props.edges) {
      this.diffEdges(nextProps.edges, this.props.edges)
      return true
    }
    return true
  }

  updateEdgesNode() {
    this.memoEdges = Object.keys(this.edgeInstances).map(k => this.edgeInstances[k])
  }

  diffEdges(nextEdges: Edges, lastEdges: Edges) {
    let dirty = false
    const deleted = { ...lastEdges }
    for (const key in nextEdges) {
      const val = nextEdges[key], lastVal = lastEdges[key]
      if (lastVal === undefined) {
        !dirty && (dirty = true)
        this.mountEdge(val)
      } else {
        delete deleted[key]
        if (lastVal !== val) {
          this.updateEdge(lastVal, val)
        }
      }
    }
    for (const key in deleted) {
      !dirty && (dirty = true)
      this.unmountEdge(lastEdges[key])
    }
    dirty && this.updateEdgesNode()
  }


  updateEdge = (lastEdge: Edge, newEdge: Edge) => {
    removeChild(this.edgeTree, lastEdge)
    registerChild(this.edgeTree, newEdge)
  }

  mountEdge = (edge: Edge) => {
    const { type = '', id } = edge
    this.edgeAtoms[id] = createEdgeAtom(edge)
    registerChild(this.edgeTree, edge)
    const EdgeWrapper = this.props.templates?.[type] ?? BasicEdge
    this.edgeInstances[id] = <EdgeWrapper atom={this.edgeAtoms[id]} key={id} />
  }

  unmountEdge = (edge: Edge) => {
    removeChild(this.edgeTree, edge)
    delete this.edgeInstances[edge.id]
    delete this.edgeAtoms[edge.id]
  }

  render() {
    const { connecting } = this.props
    return <svg
      className="tail-edge-container"
    >
      {this.props.children}
      {this.memoEdges}
      {connecting && <EdgeInProgress />}
    </svg>
  }
}




export default EdgeRenderer