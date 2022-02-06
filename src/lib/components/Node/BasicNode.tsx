import { Component } from "react";
import type { NodeProps } from "@types";
import styles from './BasicNode.module.scss'
// import Handle from "../Handle";

class BasicNode extends Component<NodeProps> {
  // display the source/target handle after folded
  // update when the number of handle changes

  render() {
    return <div className={`tail-basic-node ${styles.node}`}>
      {this.props.node.id}
    </div>
  }
}


export default BasicNode