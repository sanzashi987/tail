import type { EdgeProps } from "@app/types";
import { Component } from "react";
import { wrapEdge } from ".";

//Straight Edge
class BasicEdge extends Component<EdgeProps>{
  render() {
    const {
      sourceX,
      sourceY,
      targetX,
      targetY,
      markerEnd,
      markerStart
    } = this.props
    return <path
      className="tail-edge__basic"
      d={`M ${sourceX},${sourceY}L ${targetX},${targetY}`}
      markerEnd={markerEnd}
      markerStart={markerStart}
    />
  }
}


export { BasicEdge }
export default wrapEdge(BasicEdge)