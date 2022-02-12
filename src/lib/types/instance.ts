import type { HandleElement, Node, coordinates, DraggerInterface, Edge, TemplateNodeClass, EdgeTemplatesType, NodeTemplatesType, MarkerTemplatesType } from "."

export type TailRendererProps = {
  nodes: Node[]
  edges: Edge[]
  nodeTemplates?: NodeTemplatesType
  edgeTemplates?: EdgeTemplatesType
  markerTemplates?: MarkerTemplatesType
  onNodeDragStart?: () => void
  onNodeDrag?: () => void
  onNodeDragEnd?: () => void
}

export type SelectedItem<T> = {
  id: string,
  type: T
}

type SelectedNode = SelectedItem<'node'>
type SelectedEdge = SelectedItem<'edge'>

export type SelectedItemCollection = IObject<SelectedNode | SelectedEdge>


export type HandleMap = {
  [handleId: string]: HandleElement
}

export type HandlesInfo = {
  source: HandleMap
  target: HandleMap
}

export type NodeInternalInfo = { //
  folded: boolean
  handles: HandlesInfo
}
export type NodeInternals = Map<string, NodeInternalInfo>
export interface InternalMutation {
  activateItem(id: string, item: SelectedItem<'node' | 'edge'>, append?: boolean): void
  registerNode(id: string, node: NodeInternalInfo): void
  delistNode(id: string): void
}
export type ConnectMethodType = (nodeId: string, handleId: string) => void
export interface InterfaceValue
  extends ConnectInterface,
  WrapperDraggerInterface,
  InternalMutation {

}
export interface ConnectInterface {
  startConnecting: ConnectMethodType
  onConnected: ConnectMethodType
  startReconnecting: ConnectMethodType
}
// export interface DraggerInterface {
//   onDragStart?: (e: React.MouseEvent, c: coordinates) => boolean | void
//   onDrag?: (e: MouseEvent, c: coordinates) => boolean | void
//   onDragEnd?: (e: MouseEvent, c: coordinates) => boolean | void
// }

type MouseEventCollection = React.MouseEvent | MouseEvent

export type DraggerCallbacksType = {
  [key in keyof DraggerInterface]?: (e: MouseEventCollection, n: Node, c: coordinates) => boolean | void
}

export interface WrapperDraggerInterface extends DraggerCallbacksType {

}
