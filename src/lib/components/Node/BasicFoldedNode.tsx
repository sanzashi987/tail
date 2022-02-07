import { Component } from 'react'
import type { FoldedNodeProps } from '@types';
import Handle from '../Handle';
import styles from './BasicNode.module.scss'

const sourceId = 'foldedSource'
const targetId = 'foldedTarget'

class BasicFoldedNode<P extends FoldedNodeProps = FoldedNodeProps, S = {}> extends Component<P, S>{



  render() {
    const { node: { id }, hasSource, hasTarget } = this.props
    
    return <div className={`tail-node__folded ${styles.node}`}>

    </div>;
  }
}


export default BasicFoldedNode