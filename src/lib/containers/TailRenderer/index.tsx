import { Component, createRef } from "react";
import NodeRenderer from "../NodeRenderer";
import EdgeRenderer from "../EdgeRenderer";
import InfiniteViewer from "../InfiniteViewer";


class TailRenderer extends Component {

  edgeRendererRef = createRef<EdgeRenderer>()


  getEdgesFromNodeId = (node: string) => {
    return this.edgeRendererRef.current?.nodeToEdge.get(node)
  }

  findUnreachableItems = () => {

  }

  render() {
    return <InfiniteViewer>
      <NodeRenderer />
      <EdgeRenderer ref={this.edgeRendererRef} />
    </InfiniteViewer>
  }
}


export default TailRenderer