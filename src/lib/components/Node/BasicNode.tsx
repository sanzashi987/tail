import { Component } from "react";
import type { NodeProps } from "@types";
import styles from './BasicNode.module.scss'
// import Handle from "../Handle";

class BasicNode<P extends NodeProps = NodeProps, S = {}> extends Component<P, S> {
  render() {
    return <div className={`tail-node__basic ${styles.node}`}>
      {this.props.node.id}
    </div>
  }
}

export default BasicNode