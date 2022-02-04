import React, { Component } from 'react';
import type { EdgeRendererProps, NodeEdgeMap, Edge } from '@types'


type EdgeRenderStates = {

}
class EdgeRenderer extends Component<EdgeRendererProps, EdgeRenderStates> {

  nodeToEdge: NodeEdgeMap = new Map()

  // edgeParsed:

  componentDidMount() {

  }

  parseEdges(edge: Edge[]) {

  }

  componentDidUpdate(prevProps: EdgeRendererProps) {
    if (prevProps.edges !== this.props.edges) {

    }

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