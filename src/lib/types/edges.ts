/* eslint-disable @typescript-eslint/ban-types */
import React, { ComponentType, CSSProperties } from 'react';
import type { ImmerUpdater, JotaiImmerAtom, AtomForceRender } from './jotai';
import type { DescriberType, HandleType } from './handles';
import type { UpdaterType } from './instance';

export type EdgeBasic = {
  source: string;
  sourceNode: string;
  sourceDescriber?: DescriberType;
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

export type ConnectingEdgeProps = EdgeBasicProps & Pick<EdgeInProgressAtomState, 'pairedStatus'>;

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

export type TailEdgeCallback = (e: React.MouseEvent, edge: EdgeAtomState) => void;

export interface EdgeMouseInterface {
  onEdgeClick?: TailEdgeCallback;
  onEdgeContextMenu?: TailEdgeCallback;
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
  connectingEdge?: ComponentType<ConnectingEdgeProps>;
};

type NodeId = string;
type HandleId = string;
type EdgeId = string;
export type EdgeTree = Map<NodeId, Map<HandleId, Map<EdgeId, EdgeId>>>;

// edge in progress
export type EdgeInProgressAtomState = {
  nodeId: string;
  handleId: string;
  to: HandleType;
  active: boolean;
  reconnect: boolean;
  prevEdgeId?: string;
  describer?: DescriberType;
  /**
   * `null` indicates the edge in not under the paired status
   *
   * developers can use this field to apply responsive styles on their customized `EdgeInProgress`
   * component to provide information to their users such as the connection of edge is legal or not
   */
  pairedStatus: EdgePairedResult | null;
} & EdgeBasicProps;

export type EdgeInProgressAtomUpdater = (updater: ImmerUpdater<EdgeInProgressAtomState>) => void;

export type EdgeInProgressProps = {
  template?: EdgeRendererProps['connectingEdge'];
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

export enum EdgePairedResult {
  allow = 'allow',
  notAllow = 'notAllow',
}
