import React, { ComponentType } from "react"

export type Edge = {
  id: string,
  source: string,
  sourceNode: string,
  target: string,
  targetNode: string
  disable?: boolean
  type?: string
  markerStart?: string
  markerEnd?: string
}
export type EdgeBasicProps = {
  sourceX: number
  sourceY: number
  targetX: number
  targetY: number
  // markerStart?: string
  // markerEnd?: string
}

export type EdgeProps = {
  edge: Edge
  selected: boolean
} & EdgeBasicProps

export type EdgeWrapperProps = {
  // onClick?: (evt: React.MouseEvent, edge: Edge) => void
  id: string
} /* & EdgeProps */

// export type templateEdgeClass = {

// }

export type EdgeTemplatesType = IObject<ComponentType<EdgeWrapperProps>>

export type EdgeRendererProps = {
  edges: IObject<Edge>
  connecting: boolean
  templates?: EdgeTemplatesType
}

// export type EdgeParsed = Map<string,>
export type AnchorProps = {
  color?: string,
  strokeWidth?: number
}

export type Marker = {
  id: string,
  height?: number,
  width?: number
  type: string
  markerUnits?: 'strokeWidth' | 'userSpaceOnUse'
  orient?: string;
} & AnchorProps

export type MarkerWrapperProps = Omit<Marker, 'type'>


export type MarkerTemplateType = ComponentType<MarkerWrapperProps>

export type MarkerTemplatesType = {
  [type: string]: MarkerTemplateType
}


export type MarkerDefsProps = {
  defaultColor?: string,
  markers?: Marker[]
  templates?: MarkerTemplatesType
}

type NodeId = string
type HandleId = string
type EdgeId = string
export type EdgeTree = Map<NodeId, Map<HandleId, Map<EdgeId, EdgeId>>>