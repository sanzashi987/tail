import { Component } from 'react'
import type { FoldedNodeProps } from '../../types';




class BasicFoldedNode<P extends FoldedNodeProps = FoldedNodeProps> extends Component<P>{

  getName() {
    return this.props.node.id
  }


  render() {
    const { } = this.props

    return null;
  }
}


export default BasicFoldedNode