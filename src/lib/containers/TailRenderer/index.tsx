import { Component } from "react";
import NodeRenderer from "../NodeRenderer";
import EdgeRenderer from "../EdgeRenderer";
import InfiniteViewer from "../InfiniteViewer";
import type { NodeEdgeMap } from "../../types/instance";

class TailRenderer extends Component {
  nodeToEdge: NodeEdgeMap = new Map()

  getEdgesFromNodeId = (node: string) => {
    return this.nodeToEdge.get(node)
  }

  findUnreachableItems = () => {

  }

  render() {
    return <InfiniteViewer>
      <NodeRenderer />
      <EdgeRenderer />
    </InfiniteViewer>
  }
}


export default TailRenderer