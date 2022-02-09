import type { ComponentType } from "react"
import type { HandleElement, coordinates, NodeInternalMutation } from "."

export type Node<T extends IObject = {}> = {
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


export type TemplateNodeClass = {
  default: ComponentType<NodeWrapperProps>
  folded: ComponentType<NodeWrapperProps>
}


export type NodeRendererProps = {
  nodes: Node[],
  templates?: IObject<TemplateNodeClass>
  templateIdentifier?: (node: Node) => string
} & Omit<NodeWrapperProps, 'node' | 'template' | 'templateFolded'>


export type NodeWrapperProps<T extends IObject = {}, P extends IObject = {}, C = NodeMouseCallback> = {
  backgroundColor?: string
  onClick?: C
  // onMouseEnter?: T
  // onMouseLeave?: T
  // onContextMenu?: T
} & {
    [key in keyof DraggerCallbacks]?: (e: MouseEventCollection, n: Node, c: coordinates) => boolean | void
  } & NodeInternalMutation & Omit<NodeProps<T, P>, 'updateNodeInternal'>

export type NodeProps<
  T extends IObject = {},
  P extends IObject = {}
  > = {
    node: Node<T>
    selected: boolean
    selectedHandles: string[]
    updateNodeInternal(): void
  } & P

type FoldedNodeExtras = {
  hasSource: boolean
  hasTarget: boolean
}

export type FoldedNodeProps<
  T extends IObject = {},
  P extends FoldedNodeExtras = FoldedNodeExtras
  > = NodeProps<T, P>


