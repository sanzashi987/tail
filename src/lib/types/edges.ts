export type Edge = {
  id: string,
  source: string,
  sourceNode: string,
  target: string,
  targetNode: string
  disable?: boolean
}



export type EdgeWrapperProps = {
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  onClick?: (evt: MouseEvent, edge: Edge) => void
}



export type EdgeRendererProps = {
  edges: Edge[]
  connecting: boolean
}

// export type EdgeParsed = Map<string,>