import type { ComponentType } from "react"
import type { HandleElement, coordinates, InternalMutation } from "."
import { HandlesInfo } from "./instance"

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

export type NodeTemplatesType = IObject<TemplateNodeClass>

export type TemplateNodeClass = {
  default: ComponentType<NodeProps>
  folded: ComponentType<NodeProps>
}

export type NodeContainerProps = {

} & TemplateNodeClass


export type NodeRendererProps = {
  nodes: string[],
  foldable?: boolean
  templates?: IObject<TemplateNodeClass>
  templatePicker?: (node: Node) => [string, string]
} & Omit<NodeWrapperProps, 'node'>


// export type NodeWrapperProps<T extends IObject = {}, P extends IObject = {}> = {
// } & Omit<NodeProps<T, P>, 'updateNodeInternal'>

export type NodeWrapperProps<T extends IObject = {}, P extends IObject = {}> = {
  id: string
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


export type NodeAtomType<T extends IObject = {}> = Omit<NodeProps<T, {}>, 'updateNodeInternal'> & {
  handles: HandlesInfo,
  forceRender: number
}