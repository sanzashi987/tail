import React, { Component, createRef, CSSProperties } from 'react';
import type { NodeWrapperProps } from '../../types';
import type { coordinates } from '../Dragger/utils/types';
import Dragger from './Dragger'

function createStyleMemo() {
  let lastX = NaN, lastY = NaN, lastRes: CSSProperties = {}
  return function (x: number, y: number) {
    if (x !== lastX || lastY !== y) {
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
    const { left, top } = props.config
    this.state = { x: left, y: top }
    this.getStyle = createStyleMemo()
  }


  onDragStart = (e: React.MouseEvent, c: coordinates) => {
    return this.props.onDragStart?.(e, this.props.config, c)
  }
  onDrag = (e: MouseEvent, c: coordinates) => {
    this.setState(c)
    return this.props.onDrag?.(e, this.props.config, c)
  }
  onDragEnd = (e: MouseEvent, c: coordinates) => {
    this.setState(c)
    return this.props.onDragEnd?.(e, this.props.config, c)
  }


  componentDidMount() {

  }


  componentDidUpdate(prevProps: NodeWrapperProps) {
    // if()
  }

  componentWillUnmount() {
    
  }




  render() {
    const { nodeClass: Node, config, selected } = this.props
    const { onDragEnd, onDrag, onDragStart } = this
    const { x, y } = this.state
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
        <Node
          config={config}
          selected={selected}
        />
      </div>
    </Dragger>

  }
}



export default NodeWrapper