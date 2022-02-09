import { NodeContainerProps } from "@app/types";
import { FC } from "react";
import styles from './Container.module.scss'





const NodeContainer: FC<NodeContainerProps> = ({
  // node
}) => {
  return <div
    className={`tail-node__container ${styles.container}`}
  >

  </div>
}


export default NodeContainer