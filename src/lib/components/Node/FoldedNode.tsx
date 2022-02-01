import React, { Component } from 'react'
import type { FoldedNodeProps } from '../../types';




class FoldedNode<P extends FoldedNodeProps<{}> = FoldedNodeProps<{}>> extends Component<P>{

  getName() {
    return this.props.config.id
  }


  render() {
    const { } = this.props

    return null;
  }
}


export default FoldedNode