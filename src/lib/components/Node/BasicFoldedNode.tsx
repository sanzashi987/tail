import { Component } from 'react'
import type { FoldedNodeProps } from '@types';




class BasicFoldedNode<P extends FoldedNodeProps = FoldedNodeProps> extends Component<P>{



  render() {
    const { id } = this.props.node

    return null;
  }
}


export default BasicFoldedNode