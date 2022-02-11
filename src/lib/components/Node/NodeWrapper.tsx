import React, { FC, CSSProperties, useRef, useMemo, useState, useCallback, useEffect, useContext, memo } from 'react';
import type { NodeWrapperProps, coordinates, NodeProps } from '@types';
import Dragger from './Dragger'
import { getHandlesPosition } from './utils';
import { InstanceInterface } from '@app/contexts/instance';
import styles from './Wrapper.module.scss'


const NodeWrapper: FC<NodeWrapperProps> = ({
  node,
  children
  // ...extendedProps
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const instanceInterface = useContext(InstanceInterface)!
  const [{ x, y }, setCoordinate] = useState({ x: node.left, y: node.top })
  if (node.left !== x || node.top !== y) {
    setCoordinate({ x: node.left, y: node.top })
  }
  const style = useMemo(() => {
    return {
      transform: `translate(${x}px,${y}px)`
    } as CSSProperties
  }, [x, y])
  // const extraProps = extendedProps as P



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
  const onNodeSelect = useCallback((e: React.MouseEvent) => {
    // if()
    // instanceInterface.activateItem()
  }, [node])
  const updateNodeInternal = useCallback(() => {
    const handles = getHandlesPosition(ref, node)
    instanceInterface.registerNode(node.id, {
      folded: !!node.fold,
      handles
    })
  }, [node.id, node.fold])


  // built-in life cycle
  useEffect(() => {
    return () => {
      instanceInterface.delistNode(node.id)
    }
  }, [node.id])



  return <Dragger
    x={x}
    y={y}
    onDragStart={dragStart}
    onDrag={drag}
    onDragEnd={dragEnd}
    nodeRef={ref}
  >
    <div
      className={`tail-node__wrapper ${styles.wrapper}`}
      style={style}
      ref={ref}
      onClick={onNodeSelect}
    >
      {React.cloneElement(children as any, {
        updateNodeInternal: updateNodeInternal
      })}

    </div>

  </Dragger>
}

export default memo(NodeWrapper)

