import type { ComponentType } from "react"
import { RecoilState } from "recoil"
import type { coordinates, AtomForceRender } from "."
import { HandlesInfo } from "./instance"
import type { BasicNode } from '../components/Node'

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
  default: typeof BasicNode
  folded: typeof BasicNode
}

export type NodeContainerProps = {

} & TemplateNodeClass


export type NodeRendererProps = {
  nodes: IObject<Node>,
  foldable?: boolean
  templates?: IObject<TemplateNodeClass>
  templatePicker?: (node: Node) => [string, string]
}


// export type NodeWrapperProps<T extends IObject = {}, P extends IObject = {}> = {
// } & Omit<NodeProps<T, P>, 'updateNodeInternal'>

export type NodeWrapperProps<T extends IObject = {}, P extends IObject = {}> = {
  atom: RecoilState<NodeAtom>
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


export type NodeAtomRaw<T extends IObject = {}> = Omit<NodeProps<T, {}>, 'updateNodeInternal'> & {
  handles: HandlesInfo
}
export type NodeAtom<T extends IObject = {}> = NodeAtomRaw<T> & AtomForceRender