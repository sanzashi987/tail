import type { ComponentType } from "react"
import type { HandleElement, coordinates, InternalMutation } from "."

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



export type TemplateNodeClass = {
  default: ComponentType<NodeProps>
  folded: ComponentType<NodeProps>
}

export type NodeContainerProps = {

} & TemplateNodeClass


export type NodeRendererProps = {
  nodes: Node[],
  foldable?: boolean
  templates?: IObject<TemplateNodeClass>
  templateIdentifier?: (node: Node) => string
} & Omit<NodeWrapperProps, 'node'>


// export type NodeWrapperProps<T extends IObject = {}, P extends IObject = {}> = {
// } & Omit<NodeProps<T, P>, 'updateNodeInternal'>

export type NodeWrapperProps<T extends IObject = {}, P extends IObject = {}> = {
  node: NodeProps<T, P>['node']
}

export type NodeProps<
  T extends IObject = {},
  P extends IObject = {}
  > = {
    node: Node<T>
    selected: boolean
    selectedHandles: string[]
    updateNodeInternal(): void
  } & P

export type FoldedNodeExtras = {
  hasSource: boolean
  hasTarget: boolean
}

export type FoldedNodeProps<
  T extends IObject = {},
  P extends IObject = FoldedNodeExtras
  > = NodeProps<T, P>


