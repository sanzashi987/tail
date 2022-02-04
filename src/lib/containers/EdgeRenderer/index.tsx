import React, { Component } from 'react';
import type { EdgeRendererProps, NodeEdgeMap, Edge } from '@types'
import { } from '@app/components/Edge'

type EdgeRenderStates = {

}
class EdgeRenderer extends Component<EdgeRendererProps, EdgeRenderStates> {

  nodeToEdge: NodeEdgeMap = new Map()

  // edgeParsed:

  edgeInstances: React.ReactNode

  parseEdges(edge: Edge[]) {

  }

  componentDidUpdate(prevProps: EdgeRendererProps) {

  }


  render() {
    const { connecting } = this.props
    return <svg
      className="tail-edge-container"
    >
      {
      }


    </svg>
  }
}


export default EdgeRenderer