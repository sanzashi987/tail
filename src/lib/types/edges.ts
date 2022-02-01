export type Edge = {
  id: string,
  source: string,
  sourceNode: string,
  target: string,
  targetNode: string
  disable?: boolean
}



export type EdgeWrapperProps = {
  onClick?: (evt: MouseEvent, edge: Edge) => void
  
}