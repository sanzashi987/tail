import type { ComponentType } from "react"
import type { HandleElement, coordinates, NodeInternalMutation } from "."

export type Node<T = {}> = {
  id: string
  left: number
  top: number
  fold?: boolean
  disable?: boolean
  type: string
} & T


type MouseEventCollection = React.MouseEvent | MouseEvent

export type NodeMouseCallback = (e: MouseEventCollection, n: Node) => void
export type DraggerMouseCallback = (e: MouseEventCollection, c: coordinates) => boolean | void

export type DraggerCallbacks = {
  onDragStart?: (e: React.MouseEvent, c: coordinates) => boolean | void
  onDrag?: (e: MouseEvent, c: coordinates) => boolean | void
  onDragEnd?: (e: MouseEvent, c: coordinates) => boolean | void
}

export type NodeComponentType = ComponentType<NodeWrapperProps>

export type TemplateNodeClass = {
  default: NodeComponentType
  folded: NodeComponentType
}


export type NodeRendererProps = {
  nodes: Node[],
  templates?: IObject<TemplateNodeClass>
  templateIdentifier?: (node: Node) => string
} & Omit<NodeWrapperProps, 'node' | 'template' | 'templateFolded'>


export type NodeWrapperProps<T = NodeMouseCallback> = {
  backgroundColor?: string
  node: Node
  selected: boolean
  onClick?: T
  // onMouseEnter?: T
  // onMouseLeave?: T
  // onContextMenu?: T
} & {
    [key in keyof DraggerCallbacks]?: (e: MouseEventCollection, n: Node, c: coordinates) => boolean | void
  } & NodeInternalMutation

export type NodeProps<T = {}, P = {}> = {
  node: Node<T>
  selected: boolean
  selectedHandles: string[]
  updateNodeInternal(): void
} & P


export type FoldedNodeProps<T = {}, P = {}> = {
  hasSource: boolean
  hasTarget: boolean
} & NodeProps<T, P>


