import React, { FC, ComponentType, CSSProperties, useRef, useMemo, useState, useCallback, useEffect, useContext, memo } from 'react';
import type { NodeWrapperProps, coordinates, NodeProps } from '@types';
import Dragger from './Dragger'
import { getHandlesPosition } from './utils';
import { InstanceInterface } from '@app/contexts/instance';


const wrapNode = <T, P>(
  NodeTemplate: ComponentType<NodeProps<T, P>>,
) => {

  const NodeWrapper: FC<NodeWrapperProps<T, P>> = ({
    backgroundColor,
    onClick,
    node,
    selected,
    selectedHandles,
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
    const instanceInterface = useContext(InstanceInterface)


    //built-in event callbacks
    const dragStart = useCallback((e: React.MouseEvent, c: coordinates) => {
      return instanceInterface.onDragStart?.(e, node, c)
    }, [node])
    const drag = useCallback((e: MouseEvent, c: coordinates) => {
      setCoordinate(c)
      return instanceInterface.onDrag?.(e, node, c)
    }, [node])
    const dragEnd = useCallback((e: MouseEvent, c: coordinates) => {
      setCoordinate(c)
      return instanceInterface.onDragEnd?.(e, node, c)
    }, [node])
    const updateNodeInternal = useCallback(() => {
      const handles = getHandlesPosition(ref, node)
      instanceInterface.registerNode(node.id, {
        folded: !!node.fold,
        handles
      })
    }, [node])


    // built-in life cycle
    useEffect(() => {
      return () => {
        instanceInterface.delistNode(node.id)
      }
    }, [node.id])



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

  return memo(NodeWrapper)
}


export default wrapNode