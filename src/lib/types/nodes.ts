import type { ComponentType } from "react"
import type { coordinates } from "../components/Dragger/utils/types"

export type Node<T = {}> = {
  id: string
  left: number
  top: number
  fold?: boolean
  disable?: boolean
} & T


type MouseEventCollection = React.MouseEvent | MouseEvent

export type NodeMouseCallback = (e: MouseEventCollection, n: Node) => void
export type DraggerMouseCallback = (e: MouseEventCollection, c: coordinates) => boolean | void

export type DraggerCallbacks = {
  onDragStart?: (e: React.MouseEvent, c: coordinates) => boolean | void
  onDrag?: (e: MouseEvent, c: coordinates) => boolean | void
  onDragEnd?: (e: MouseEvent, c: coordinates) => boolean | void
}

export type NodeWrapperProps<T = NodeMouseCallback> = {
  backgroundColor?: string
  config: Node
  selected: boolean
  nodeClass: ComponentType<NodeProps>
  onClick?: T
  // onMouseEnter?: T
  // onMouseLeave?: T
  // onContextMenu?: T
} & {
    [key in keyof DraggerCallbacks]: (e: MouseEventCollection, n: Node, c: coordinates) => boolean | void
  }

export type NodeRendererProps = {
  nodes: Node[]
} & Omit<NodeWrapperProps, 'config'>



export type NodeProps<T = {}> = {
  config: Node
  selected: boolean
} & T


export type FoldedNodeProps<T> = {
  config: Node<T>,
  sourceFold: boolean
  targetFold: boolean
}