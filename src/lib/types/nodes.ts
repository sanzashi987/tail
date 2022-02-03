import type { ComponentType } from "react"
import { HandleElement } from "."
import type { coordinates } from "./dragger"

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

export type TemplateNodeClass = {
  default: ComponentType<NodeProps>
  folded: ComponentType<FoldedNodeProps>
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
  template: TemplateNodeClass['default'],
  templateFolded: TemplateNodeClass['folded']
  onClick?: T
  registerNodeEl(): void
  updateNodeEl(): void
  delistNodeEl(): void
  // onMouseEnter?: T
  // onMouseLeave?: T
  // onContextMenu?: T
} & {
    [key in keyof DraggerCallbacks]?: (e: MouseEventCollection, n: Node, c: coordinates) => boolean | void
  }

export type NodeProps<T = {}> = {
  node: Node
  selected: boolean
  selectedHandles: string[]
} & T


export type FoldedNodeProps<T = {}> = {
  node: Node<T>,
  sourceFold: boolean
  targetFold: boolean
}


export type NodeInternalInfo = { //
  handles: {
    source: HandleElement[]
    target: HandleElement[]
  }
}
export type MountedNodes = Map<string, NodeInternalInfo>