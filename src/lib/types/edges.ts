/* eslint-disable @typescript-eslint/ban-types */
import React, { ComponentType } from 'react';
import type { RecoilState } from 'recoil';
import { UpdaterType } from './instance';
import { AtomForceRender, HandleType, NodeAtomsType } from '.';

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
  hovered: boolean;
  reconnect: boolean;
};

export type EdgePropsFromWrapper = {
  markerStart?: string;
  markerEnd?: string;
};

export interface EdgeMouseInterface {
  onEdgeClick?: (e: React.MouseEvent, edge: Edge) => void;
  onEdgeContextMenu?: (e: React.MouseEvent, edge: Edge) => void;
}

export type EdgeAtom<T extends IObject = {}> = EdgeAtomRaw<T> & AtomForceRender;

export type EdgeAtomType = RecoilState<EdgeAtom>;

export type EdgeAtomsType = IObject<EdgeAtomType>;

export type ComputedEdgeAtom = EdgeAtom & EdgeBasicProps;

export type EdgeProps = Omit<EdgeAtomRaw, 'reconnect'> & EdgeBasicProps & EdgePropsFromWrapper;

export type EdgeWrapperProps<T extends IObject = {}> = {
  // id: string
  atom: RecoilState<EdgeAtom<T>>;
  nodeAtoms: NodeAtomsType;
  templates: EdgeTemplatesType;
  updateEdge(lastEdge: Edge, nextEdge: Edge): void;
  // template: ComponentType<EdgeProps>;
  // shadow: ComponentType<EdgeBasicProps>;
  // onClick?: (evt: React.MouseEvent, edge: Edge) => void
}; /* & EdgeProps */

export type SelectorInput = {
  edge: EdgeAtomType;
  nodeAtoms: NodeAtomsType;
};

export type EdgeComponentPackType = {
  default: ComponentType<EdgeProps>;
  shadow: ComponentType<EdgeBasicProps>;
};

export type EdgeTemplatesType = IObject<EdgeComponentPackType>;

export type EdgeRendererProps = {
  // edges: IObject<Edge>;
  // connecting: boolean;
  templates: EdgeTemplatesType;
  // getNodeAtoms(): NodeAtomsType;
  // storeUpdater: (atom: RecoilState<EdgeAtom>, updater: UpdaterType<EdgeAtom>) => void;
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
  // defaultColor?: string;
  markers?: Marker[];
  markerTemplates?: MarkerTemplatesType;
};

type NodeId = string;
type HandleId = string;
type EdgeId = string;
export type EdgeTree = Map<NodeId, Map<HandleId, Map<EdgeId, EdgeId>>>;

export type EdgeInProgressAtomType = {
  nodeId: string;
  handleId: string;
  to: HandleType;
  active: boolean;
  reconnect: boolean;
  prevEdgeId?: string;
} & EdgeBasicProps;

export type EdgeInProgressAtomUpdater = (updater: UpdaterType<EdgeInProgressAtomType>) => void;

export type EdgeInProgressProps = {
  template: ComponentType<EdgeBasicProps>;
};
