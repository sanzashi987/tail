import React, { Component, ComponentType, createRef, CSSProperties } from 'react';
import type { NodeWrapperProps, coordinates, NodeProps, FoldedNodeProps, HandlesInfo } from '@types';
import Dragger from './Dragger'
import { getHandleBounds } from './utils';

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

const EmptyHandles = { source: {}, target: {} }


type NodeWrapperState = coordinates
type PossibleNodeClass = ComponentType<NodeProps> | ComponentType<FoldedNodeProps>

const wrapNode = (
  NodeTemplate: PossibleNodeClass,
  isFold?: boolean
) => {
  const NodeWrapper = class extends Component<NodeWrapperProps, NodeWrapperState> {
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

    getProps() {
      const { node, selected } = this.props
      const NodeProps = {
        node,
        selected,
        updateNodeInternal: this.registerNode
      }
      if (isFold) {

      }
      return NodeProps
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
      const { node: { id }, delistNode } = this.props
      delistNode(id)
    }


    registerNode = () => {
      const { node, registerNode } = this.props
      const handles = this.getHandlesPosition();
      registerNode(node.id, {
        folded: !!node.fold,
        handles,
      })
    }

    getHandlesPosition(): HandlesInfo {
      if (!this.ref.current) {
        console.warn('fail to retrieve the DOM instance of', this.props.node);
        return EmptyHandles
      }
      return getHandleBounds(this.ref.current, 1)
    }

    render() {
      const { node, selected } = this.props
      const { onDragEnd, onDrag, onDragStart } = this
      const { x, y } = this.state
      const props = this.getProps()
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
          <NodeTemplate
            {...props}
          />
        </div>
      </Dragger>

    }
  }
  return NodeWrapper
}


export default wrapNode