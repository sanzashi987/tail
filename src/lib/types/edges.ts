/* eslint-disable @typescript-eslint/ban-types */
import React, { ComponentType } from 'react';
import type { RecoilState } from 'recoil';
import { AtomForceRender, NodeAtomsType } from '.';

export type EdgeBasic = {
  source: string;
  sourceNode: string;
  target: string;
  targetNode: string;
};

export type Edge<T extends IObject = {}> = {
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
  // markerStart?: string
  // markerEnd?: string
};

export type EdgeAtomRaw<T extends IObject = {}> = {
  edge: Edge<T>;
  selected: boolean;
  reconnect: boolean;
};

export type EdgePropsFromWrapper = {
  markerStart?: string;
  markerEnd?: string;
};

export interface EdgeMouseInterface {
  onEdgeClick: (e: React.MouseEvent, edge: Edge) => void;
}

export type EdgeAtom<T extends IObject = {}> = EdgeAtomRaw<T> & AtomForceRender;

export type EdgeAtomsType = IObject<RecoilState<EdgeAtom>>;

export type ComputedEdgeAtom = EdgeAtom & EdgeBasicProps;

export type EdgeProps = Omit<EdgeAtomRaw, 'reconnect'> & EdgeBasicProps & EdgePropsFromWrapper;

export type EdgeWrapperProps<T extends IObject = {}> = {
  // id: string
  atom: RecoilState<EdgeAtom<T>>;
  nodeAtoms: NodeAtomsType;
  template: EdgeComponentType;
  // onClick?: (evt: React.MouseEvent, edge: Edge) => void
}; /* & EdgeProps */

export type SelectorInput = {
  edge: RecoilState<EdgeAtom>;
  nodeAtoms: NodeAtomsType;
};

export type EdgeComponentType = ComponentType<EdgeProps>;

export type EdgeTemplatesType = IObject<EdgeComponentType>;

export type EdgeRendererProps = {
  edges: IObject<Edge>;
  // connecting: boolean;
  templates?: EdgeTemplatesType;
  getNodeAtoms(): NodeAtomsType;
};

// export type EdgeParsed = Map<string,>
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
  defaultColor?: string;
  markers?: Marker[];
  templates?: MarkerTemplatesType;
};

type NodeId = string;
type HandleId = string;
type EdgeId = string;
export type EdgeTree = Map<NodeId, Map<HandleId, Map<EdgeId, EdgeId>>>;

export type EdgeInProgressAtomType = {
  sourceNode: string;
  source: string;
  active: boolean;
} & EdgeBasicProps;

export type EdgeInProgressProps = {
  template: ComponentType<EdgeBasicProps>;
};
