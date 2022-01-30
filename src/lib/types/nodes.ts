export type Node<T = {}> = {
  id: string
  fold?: boolean
  left: number
  top: number
  disable?: boolean
} & T



export type NodeWrapperProps = {
  
}