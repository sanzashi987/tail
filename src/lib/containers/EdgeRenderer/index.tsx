import React, { Component } from 'react';
import type { EdgeRendererProps, NodeEdgeMap, Edge } from '@types'
import { EdgeInProgress } from '@app/components/Edge'

type EdgeRenderStates = {
  memoEdges: EdgeRendererProps['edges']
}


const parseEdges = (nextEdges: EdgeRendererProps['edges'], lastEdges: EdgeRendererProps['edges']) => {

}
class EdgeRenderer extends Component<EdgeRendererProps, EdgeRenderStates> {

  nodeToEdge: NodeEdgeMap = new Map()

  // edgeParsed:
  state: EdgeRenderStates = {
    memoEdges: {}
  }

  static getDerivedStateFromProps(nextProps: EdgeRendererProps, prevState: EdgeRenderStates) {
    if (nextProps.edges !== prevState.memoEdges) {



      return {
        memoEdges: nextProps.edges,
      }
    }
  }

  edgeInstances: React.ReactNode

  render() {
    const { connecting } = this.props
    return <svg
      className="tail-edge-container"
    >
      {this.props.children}
      {
      }

      {
        connecting && <EdgeInProgress />
      }
    </svg>
  }
}


export default EdgeRenderer