import React from 'react';
import { RecoilValue, RecoilState } from 'recoil';
import { NodeMouseInterface } from './nodes';
import { EdgeBasic, EdgeMouseInterface } from './edges';
import type {
  HandleElement,
  Node,
  Edge,
  EdgeTemplatesType,
  NodeTemplatesType,
  MarkerTemplatesType,
} from '.';

export type TailRendererOptionalProps = {
  nodeTemplates: NodeTemplatesType;
  edgeTemplates: EdgeTemplatesType;
  markerTemplates: MarkerTemplatesType;
} & NodeMutation &
  EdgeMutation &
  NodeMouseInterface &
  EdgeMouseInterface;

export type TailRendererProps = {
  nodes: IObject<Node>;
  edges: IObject<Edge>;
} & NodeMouseInterface &
  EdgeMouseInterface &
  TailRendererOptionalProps;

export interface NodeMutation {
  onNodeCreate(): void;
  // onNodeUpdate(): void;
  onNodeDelete(): void;
}

export interface EdgeMutation {
  onEdgeCreate(edgeBasic: EdgeBasic): void;
  onEdgeUpdate(): void;
  onEdgeDelete(): void;
}

export type SelectedItemType = 'node' | 'edge';

export type SelectedItemCollection = IObject<{
  id: string;
  type: SelectedItemType;
}>;

export type HandleMap = {
  [handleId: string]: HandleElement;
};

export type HandlesInfo = {
  source: HandleMap;
  target: HandleMap;
};

export type NodeInternalInfo = {
  //
  folded: boolean;
  handles: HandlesInfo;
};
export type NodeInternals = Map<string, NodeInternalInfo>;
export interface GeneralMethods extends ConnectInterface {
  activateItem(e: React.MouseEvent, type: SelectedItemType, id: string): void;
  getScale(): number;
}
export type ConnectMethodType = (nodeId: string, handleId: string) => void;
export interface InterfaceValue extends GeneralMethods {
  edge: EdgeMouseInterface;
  node: NodeMouseInterface;
}
export interface ConnectInterface {
  startConnecting: (e: React.MouseEvent, nodeId: string, handleId: string) => void;
  onConnected: ConnectMethodType;
  startReconnecting: ConnectMethodType;
}

type MouseEventCollection = React.MouseEvent | MouseEvent;

export interface RecoilNexusInterface {
  getRecoil: <T>(atom: RecoilValue<T>) => T;
  getRecoilPromise: <T>(atom: RecoilValue<T>) => Promise<T>;
  setRecoil: <T>(atom: RecoilState<T>, valOrUpdater: T | ((currVal: T) => T)) => void;
  resetRecoil: (atom: RecoilState<any>) => void;
}

export type AtomForceRender = {
  forceRender: number;
};
