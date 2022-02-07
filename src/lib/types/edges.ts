import React, { ComponentType } from "react"

export type Edge = {
  id: string,
  source: string,
  sourceNode: string,
  target: string,
  targetNode: string
  disable?: boolean
  type?: string
}

export type EdgeBasicProps = {
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  markerStart?: string
  markerEnd?: string
}

export type EdgeProps = {
  edge: Edge
  selected: boolean
} & EdgeBasicProps

export type EdgeWrpperProps = {
  onClick?: (evt: React.MouseEvent, edge: Edge) => void
} & EdgeProps

// export type templateEdgeClass = {

// }

export type EdgeRendererProps = {
  edges: Edge[]
  connecting: boolean
  templates?: IObject<ComponentType<EdgeWrpperProps>>
}

// export type EdgeParsed = Map<string,>