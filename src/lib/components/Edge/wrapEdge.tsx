import React, { FC, ComponentType, memo, useMemo, PureComponent, useCallback } from "react";
import type { EdgeProps, EdgeWrapperProps } from "@app/types";


const getMarkerId = (markerId?: string) => {
  if (typeof markerId === 'string') return `url(#${markerId})`
}


const wrapEdge = (EdgeComponent: ComponentType<EdgeProps>) => {
  const EdgeWrapper: FC<EdgeWrapperProps> = ({
    onClick,
    markerEnd,
    markerStart,
    ...edgeProps
  }) => {
    const onEdgeClick = useCallback((e: React.MouseEvent) => {
      e.stopPropagation()
      onClick?.(e, edgeProps.edge)
    }, [onClick, edgeProps.edge])
    const markerStartUrl = useMemo(() => getMarkerId(markerStart), [markerStart]);
    const markerEndUrl = useMemo(() => getMarkerId(markerEnd), [markerEnd]);
    return <g
      onClick={onEdgeClick}
    >
      <EdgeComponent
        markerStart={markerStartUrl}
        markerEnd={markerEndUrl}
        {...edgeProps}
      />
    </g>
  }

  return EdgeWrapper
}


export default wrapEdge
