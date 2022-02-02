import React, { Component } from 'react';
import { NodeEdgeMap } from '../../types/instance';
import type  { EdgeRendererProps } from '../../types/edges'



class EdgeRenderer extends Component<EdgeRendererProps> {
  nodeToEdge: NodeEdgeMap = new Map()

  componentDidMount() {

  }


  render() {

    return <svg
      className="tail-edge-container"
    >

    </svg>
  }
}


export default EdgeRenderer