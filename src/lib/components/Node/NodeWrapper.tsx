import React, { Component, createRef, CSSProperties } from 'react';
import type { NodeWrapperProps, coordinates } from '@types';
import Dragger from './Dragger'

function createStyleMemo() {
  let lastX = NaN, lastY = NaN, lastRes: CSSProperties = {}
  return function (x: number, y: number) {
    if (x !== lastX || lastY !== y) {
      [lastX, lastY] = [x, y]
      lastRes = {
        transform: `translate(${x}px,${y}px)`
      }
    }

    return lastRes
  }
}


type NodeWrapperState = coordinates
class NodeWrapper extends Component<NodeWrapperProps, NodeWrapperState> {
  ref = createRef<HTMLDivElement>()

  state = {
    x: NaN,
    y: NaN
  }

  getStyle: (x: number, y: number) => CSSProperties

  constructor(props: NodeWrapperProps) {
    super(props)
    const { left, top } = props.node
    this.state = { x: left, y: top }
    this.getStyle = createStyleMemo()
  }


  onDragStart = (e: React.MouseEvent, c: coordinates) => {
    return this.props.onDragStart?.(e, this.props.node, c)
  }
  onDrag = (e: MouseEvent, c: coordinates) => {
    this.setState(c)
    return this.props.onDrag?.(e, this.props.node, c)
  }
  onDragEnd = (e: MouseEvent, c: coordinates) => {
    this.setState(c)
    return this.props.onDragEnd?.(e, this.props.node, c)
  }


  componentDidMount() {

  }


  componentDidUpdate(prevProps: NodeWrapperProps) {
    // if()
  }

  componentWillUnmount() {
    const { node: { id }, delistNodeEl } = this.props
    delistNodeEl(id)
  }

  getHandlesPosition() {

  }




  render() {
    const { template, node, selected } = this.props
    const { onDragEnd, onDrag, onDragStart } = this
    const { x, y } = this.state
    const { fold = false } = node
    return <Dragger
      onDragStart={onDragStart}
      onDrag={onDrag}
      onDragEnd={onDragEnd}
      nodeRef={this.ref}
    >
      <div
        className="tail-node-wrapper"
        ref={this.ref}
        style={this.getStyle(x, y)}
      >
        {!fold ? <template.default
          node={node}
          selected={selected}
        /> :
          <template.folded />
        }
      </div>
    </Dragger>

  }
}



export default NodeWrapper