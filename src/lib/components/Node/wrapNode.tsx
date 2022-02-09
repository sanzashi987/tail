import React, { FC, Component, ComponentType, createRef, CSSProperties, useRef, useMemo, useState, useCallback, useEffect } from 'react';
import type { NodeWrapperProps, coordinates, NodeProps, FoldedNodeProps, HandlesInfo } from '@types';
import Dragger from './Dragger'
import { getHandleBounds, getHandlesPosition } from './utils';


const wrapNode = <T, P>(
  NodeTemplate: ComponentType<NodeProps<T, P>>,
) => {

  const NodeWrapper: FC<NodeWrapperProps<T, P>> = ({
    backgroundColor,
    onClick,
    onDrag,
    onDragEnd,
    onDragStart,
    node,
    selected,
    selectedHandles,
    delistNode,
    registerNode,
    ...extendedProps
  }) => {
    const ref = useRef<HTMLDivElement>(null)
    const [coordinate, setCoordinate] = useState({ x: node.left, y: node.top })
    const style = useMemo(() => {
      return {
        transform: `translate(${coordinate.x}px,${coordinate.y}px)`
      } as CSSProperties
    }, [coordinate])
    const extraProps = extendedProps as P


    //built-in event callbacks
    const dragStart = useCallback((e: React.MouseEvent, c: coordinates) => {
      return onDragStart?.(e, node, c)
    }, [onDragStart, node])
    const drag = useCallback((e: MouseEvent, c: coordinates) => {
      setCoordinate(c)
      return onDrag?.(e, node, c)
    }, [onDrag, node])
    const dragEnd = useCallback((e: MouseEvent, c: coordinates) => {
      setCoordinate(c)
      return onDragEnd?.(e, node, c)
    }, [onDragEnd, node])
    const updateNodeInternal = useCallback(() => {
      const handles = getHandlesPosition(ref, node)
      registerNode(node.id, {
        folded: !!node.fold,
        handles
      })
    }, [registerNode, node])


    // built-in life cycle
    useEffect(() => {
      return () => {
        delistNode(node.id)
      }
    }, [delistNode, node.id])



    return <Dragger
      onDragStart={dragStart}
      onDrag={drag}
      onDragEnd={dragEnd}
      nodeRef={ref}
    >
      <div
        className="tail-node__wrapper"
        style={style}
        ref={ref}
      >
        <NodeTemplate
          node={node}
          selected={selected}
          selectedHandles={selectedHandles}
          updateNodeInternal={updateNodeInternal}
          {...extraProps}
        />
      </div>

    </Dragger>
  }

  return NodeWrapper
}


export default wrapNode