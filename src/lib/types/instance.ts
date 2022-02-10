import type { HandleElement, Node, coordinates } from "."

export type NodeEdgeMap = Map<string, IObject<string>>


type SelectedItem<T> = {
  id: string,
  type: T
}

type SelectedNode = SelectedItem<'node'>
type SelectedEdge = SelectedItem<'edge'>

export type SelectedItemCollection = IObject<SelectedNode> | IObject<SelectedEdge>


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
export interface NodeInternalMutation {
  registerNode(id: string, node: NodeInternalInfo): void
  delistNode(id: string): void
}
export type ConnectMethodType = (nodeId: string, handleId: string) => void
export interface InterfaceValue
  extends ConnectInterface,
  WrapperDraggerInterface,
  NodeInternalMutation {

}
export interface ConnectInterface {
  startConnecting: ConnectMethodType
  onConnected: ConnectMethodType
  startReconnecting: ConnectMethodType
}
export interface DraggerInterface {
  onDragStart?: (e: React.MouseEvent, c: coordinates) => boolean | void
  onDrag?: (e: MouseEvent, c: coordinates) => boolean | void
  onDragEnd?: (e: MouseEvent, c: coordinates) => boolean | void
}

type MouseEventCollection = React.MouseEvent | MouseEvent

export type DraggerCallbacksType = {
  [key in keyof DraggerInterface]?: (e: MouseEventCollection, n: Node, c: coordinates) => boolean | void
}

export interface WrapperDraggerInterface extends DraggerCallbacksType {

}
