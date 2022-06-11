/* eslint-disable @typescript-eslint/ban-types */
import React, { ComponentType, CSSProperties } from 'react';
import type { ImmerUpdater, JotaiImmerAtom, AtomForceRender } from './jotai';
import type { HandleType } from './handles';
import type { UpdaterType } from './instance';

export type EdgeBasic = {
  source: string;
  sourceNode: string;
  target: string;
  targetNode: string;
};

export type Edge<T extends Record<string, any> = {}> = {
  id: string;
  disable?: boolean;
  type?: string;
  markerStart?: string;
  markerEnd?: string;
} & EdgeBasic &
  T;

export type EdgeBasicProps = {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
};

export type EdgeAtomStateRaw<T extends Record<string, any> = {}> = {
  edge: Edge<T>;
  selected: boolean;
  hovered: boolean;
  reconnect: boolean;
};

export type EdgePropsFromWrapper = {
  markerStart?: string;
  markerEnd?: string;
  setContainerStyle(css: UpdaterType<CSSProperties>): void;
};

export interface EdgeMouseInterface {
  onEdgeClick?: (e: React.MouseEvent, edge: Edge) => void;
  onEdgeContextMenu?: (e: React.MouseEvent, edge: Edge) => void;
}

export type EdgeAtomState<T extends Record<string, any> = {}> = EdgeAtomStateRaw<T> &
  AtomForceRender;
export type EdgeAtom = JotaiImmerAtom<EdgeAtomState>;
export type EdgeAtoms = Record<string, EdgeAtom>;

export type EdgeTemplatesType = Record<string, EdgeComponentPackType>;
export type EdgeProps = Omit<EdgeAtomStateRaw, 'reconnect'> & EdgeBasicProps & EdgePropsFromWrapper;
export type EdgeWrapperProps<T extends Record<string, any> = {}> = {
  atom: JotaiImmerAtom<EdgeAtomState<T>>;
  templates: EdgeTemplatesType;
};

export type EdgeComponentPackType = {
  default: ComponentType<EdgeProps>;
  shadow: ComponentType<EdgeBasicProps>;
};

export type EdgeRendererProps = {
  templates: EdgeTemplatesType;
  connectingEdge?: ComponentType<EdgeBasicProps>;
};

type NodeId = string;
type HandleId = string;
type EdgeId = string;
export type EdgeTree = Map<NodeId, Map<HandleId, Map<EdgeId, EdgeId>>>;

// edge in progress
export type EdgeInProgressAtomType = {
  nodeId: string;
  handleId: string;
  to: HandleType;
  active: boolean;
  reconnect: boolean;
  prevEdgeId?: string;
} & EdgeBasicProps;

export type EdgeInProgressAtomUpdater = (updater: ImmerUpdater<EdgeInProgressAtomType>) => void;

export type EdgeInProgressProps = {
  template?: ComponentType<EdgeBasicProps>;
};

// markers
export type AnchorProps = {
  color?: string;
  strokeWidth?: number;
};

export type Marker = {
  id: string;
  height?: number;
  width?: number;
  type: string;
  markerUnits?: 'strokeWidth' | 'userSpaceOnUse';
  orient?: string;
} & AnchorProps;

export type MarkerWrapperProps = Omit<Marker, 'type'>;

export type MarkerTemplateType = ComponentType<MarkerWrapperProps>;

export type MarkerTemplatesType = {
  [type: string]: MarkerTemplateType;
};

export type MarkerDefsProps = {
  // defaultColor?: string;
  markers?: Marker[];
  markerTemplates?: MarkerTemplatesType;
};
