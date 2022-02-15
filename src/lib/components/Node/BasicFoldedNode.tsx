import { Component, ComponentType } from 'react'
import type { NodeProps } from '@types';
import Handle from '../Handle';
import styles from './BasicNode.module.scss'

const sourceId = 'foldedSource'
const targetId = 'foldedTarget'

class BasicFoldedNode<P extends NodeProps = NodeProps, S = {}> extends Component<P, S>{


  render() {
    const { node: { id } } = this.props
    return <div className={`tail-node__folded ${styles.node}`}>
      <Handle nodeId={id} type='source' handleId={sourceId} />
      <Handle nodeId={id} type='target' handleId={targetId} />
    </div>;
  }
}

export default BasicFoldedNode