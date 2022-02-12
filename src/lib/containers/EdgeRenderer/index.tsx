import React, { FC, Component, useRef, useState, ReactNode, useMemo, useImperativeHandle } from 'react';
import type { EdgeRendererProps, EdgeTree, Edge } from '@types'
import { EdgeInProgress } from '@app/components/Edge'

type Edges = EdgeRendererProps['edges']

// type EdgeRenderStates = {
//   memoEdges: Edges
// }

function removeChild(edgeTree: EdgeTree, edge: Edge) {
  const { source, sourceNode, target, targetNode, id } = edge
  edgeTree.get(sourceNode)?.get(source)?.delete(id)
  edgeTree.get(targetNode)?.get(target)?.delete(id)
}

function ensureParent(tree: Map<string, any>, parentId: string) {
  if (tree.get(parentId) === undefined) {
    tree.set(parentId, new Map())
  }
}

function setChild(edgeTree: EdgeTree, nodeId: string, handleId: string, edgeId: string) {
  ensureParent(edgeTree, nodeId)
  const nodeMap = edgeTree.get(nodeId)!
  ensureParent(nodeMap, handleId)
  nodeMap.get(handleId)!.set(edgeId, edgeId)
}

function registerChild(edgeTree: EdgeTree, edge: Edge) {
  const { source, sourceNode, target, targetNode, id } = edge
  setChild(edgeTree, sourceNode, source, id)
  setChild(edgeTree, targetNode, target, id)
}


function parseEdges(nextEdges: Edges/* , lastEdges: Edges */, edgeTree: EdgeTree) {
  Object.keys(nextEdges).forEach(key => {
    const nextEdge = nextEdges[key]/* , lastEdge = lastEdges[key] */
    // if (nextEdge !== lastEdge) {
    //   if (lastEdge) {
    //     removeChild(edgeTree, lastEdge)
    //   }
    registerChild(edgeTree, nextEdge)
    // }
  })
}



class EdgeRenderer extends Component<EdgeRendererProps> {

  // nodeToHandleToEdge =

  edgeTree: EdgeTree = new Map()

  constructor(props: EdgeRendererProps) {
    super(props)
    parseEdges(props.edges, this.edgeTree)
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