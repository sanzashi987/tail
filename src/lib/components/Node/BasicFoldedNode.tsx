import { Component, ComponentType } from 'react'
import type { FoldedNodeProps, NodeProps, Node, FoldedNodeExtras } from '@types';
import Handle from '../Handle';
import wrapNode from "./wrapNode";
import styles from './BasicNode.module.scss'

const sourceId = 'foldedSource'
const targetId = 'foldedTarget'

class BasicFoldedNode<P extends FoldedNodeProps = FoldedNodeProps, S = {}> extends Component<P, S>{



  render() {
    const { node: { id }, hasSource, hasTarget } = this.props
    return <div className={`tail-node__folded ${styles.node}`}>
      {hasSource && <Handle nodeId={id} type='source' handleId={sourceId} />}
      {hasTarget && <Handle nodeId={id} type='target' handleId={targetId} />}
    </div>;
  }
}


export { BasicFoldedNode }
const WrappedBasicNode = wrapNode(BasicFoldedNode as ComponentType<FoldedNodeProps<{}, FoldedNodeExtras>>)
export default WrappedBasicNode