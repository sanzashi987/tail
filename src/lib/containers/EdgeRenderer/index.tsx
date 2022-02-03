import React, { Component } from 'react';
import type { EdgeRendererProps, NodeEdgeMap, Edge } from '../../types'



class EdgeRenderer extends Component<EdgeRendererProps> {
  nodeToEdge: NodeEdgeMap = new Map()

  componentDidMount() {

  }

  parseEdges(edge: Edge[]) {

  }


  render() {

    return <svg
      className="tail-edge-container"
    >

    </svg>
  }
}


export default EdgeRenderer