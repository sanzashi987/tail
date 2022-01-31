import type { ComponentType } from "react"

export type Node<T = {}> = {
  id: string
  left: number
  top: number
  fold?: boolean
  disable?: boolean
} & T

export type NodeWrapperProps = {
  backgroundColor?: string
  config: Node
  nodeClass: ComponentType<NodeProps>
}


export type NodeProps<T = {}> = {
  config: Node
} & T