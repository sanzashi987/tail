import React, { Component, } from 'react';
import type { EdgeRendererProps, EdgeTree, Edge, EdgeTemplatesType } from '@types'
import { EdgeInProgress, BasicEdge } from '@app/components/Edge'
import { registerChild, removeChild } from './utils'

type Edges = EdgeRendererProps['edges']
class EdgeRenderer extends Component<EdgeRendererProps> {

  edgeTree: EdgeTree = new Map()
  edgeInstances: IObject<React.ReactNode> = {}

  constructor(props: EdgeRendererProps) {
    super(props)
    this.parseEdges(props.edges)
  }

  parseEdges(edges: Edges) {
    Object.keys(edges).forEach(key => {
      this.mountEdge(edges[key])
    })
  }

  shouldComponentUpdate(nextProps: EdgeRendererProps) {
    if (nextProps.edges !== this.props.edges) {
      const curr = nextProps.edges, last = this.props.edges
      const deleted = { ...last }
      for (const key in nextProps.edges) {
        const val = curr[key], lastVal = last[key]
        if (lastVal === undefined) {
          this.mountEdge(val)
        } else {
          delete deleted[key]
          if (lastVal !== val) {
            this.updateEdge(lastVal, val)
          }
        }
      }
      for (const key in deleted) {
        this.unmountEdge(last[key])
      }
    }
    return true
  }

  updateEdge = (lastEdge: Edge, newEdge: Edge) => {
    removeChild(this.edgeTree, lastEdge)
    registerChild(this.edgeTree, newEdge)
  }

  mountEdge = (edge: Edge) => {
    registerChild(this.edgeTree, edge)
    const { type = '', id } = edge
    const EdgeWrapper = this.props.templates?.[type] ?? BasicEdge
    this.edgeInstances[id] = <EdgeWrapper id={id} key={id} />
  }

  unmountEdge = (edge: Edge) => {
    removeChild(this.edgeTree, edge)
    delete this.edgeInstances[edge.id]
  }

  render() {
    const { connecting } = this.props
    return <svg
      className="tail-edge-container"
    >
      {this.props.children}
      {Object.keys(this.edgeInstances).map(k => this.edgeInstances[k])}
      {connecting && <EdgeInProgress />}
    </svg>
  }
}




export default EdgeRenderer