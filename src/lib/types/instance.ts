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
  EdgeAtom,
  NodeAtom,
  HandleType,
} from '.';

export type TailCoreOptionalProps = {
  nodeTemplates: NodeTemplatesType;
  edgeTemplates: EdgeTemplatesType;
  markerTemplates: MarkerTemplatesType;
  dropThreshold: number;
  quickNodeUpdate: boolean;
  onDelete(nodes: string[], edges: string[]): void; //come with id array
} & NodeMutation &
  EdgeMutation &
  NodeMouseInterface &
  EdgeMouseInterface;

export type TailCoreProps = {
  nodes: IObject<Node>;
  edges: IObject<Edge>;
} & NodeMouseInterface &
  EdgeMouseInterface &
  TailCoreOptionalProps;

export interface NodeMutation {
  // onNodeCreate(): void;
  onNodeUpdate(id: Node[]): void;
  // onNodeDelete(): void;
}

export interface EdgeMutation {
  onEdgeCreate(edgeBasic: EdgeBasic): void;
  onEdgeUpdate(id: string, edgeBasic: EdgeBasic): void;
  // onEdgeDelete(): void;
}

export type SelectedItemType = 'node' | 'edge';

export type SelectedItemCollection = {
  node: IObject<string>;
  edge: IObject<string>;
};

export type HandleMap = {
  [handleId: string]: HandleElement;
};

export type HandlesInfo = {
  source: HandleMap;
  target: HandleMap;
};

// export type NodeInternalInfo = {
//   //
//   folded: boolean;
//   handles: HandlesInfo;
// };
// export type NodeInternals = Map<string, NodeInternalInfo>;
export interface GeneralMethods {
  activateItem(e: React.MouseEvent, type: SelectedItemType, id: string, selected: boolean): void;
  getScale(): number;
}
export type ConnectMethodType = (
  e: React.MouseEvent,
  type: HandleType,
  nodeId: string,
  handleId: string,
) => void;
export interface InterfaceValue extends GeneralMethods {
  edge: EdgeMouseInterface;
  node: NodeMouseInterface;
  handle: HandleInterface;
}
export interface HandleInterface {
  onMouseDown: ConnectMethodType;
  onMouseUp: ConnectMethodType;
}

export interface RecoilNexusInterface {
  getRecoil: <T>(atom: RecoilValue<T>) => T;
  getRecoilPromise: <T>(atom: RecoilValue<T>) => Promise<T>;
  setRecoil: <T>(atom: RecoilState<T>, valOrUpdater: UpdaterType<T>) => void;
  resetRecoil: (atom: RecoilState<any>) => void;
}

export type UpdaterType<T> = T | ((currVal: T) => T);

export interface StoreRootInterface {
  get: <T>(atom: RecoilValue<T>) => T;
  getPromise: <T>(atom: RecoilValue<T>) => Promise<T>;
  set: <T>(atom: RecoilState<T>, valOrUpdater: UpdaterType<T>) => void;
  reset: (atom: RecoilState<any>) => void;
}

export type AtomForceRender = {
  forceRender: number;
};

// export type PoolType<T> = T extends 'edge'
//   ? RecoilState<EdgeAtom>
//   : T extends 'node'
//   ? RecoilState<NodeAtom>
//   : never;

export type DeleteItem = {
  type: SelectedItemType;
  id: string;
};

export type DeletePayload = DeleteItem[];

export type AtomStateGetterType = <T>(type: SelectedItemType, id: string) => T;
export type AtomStateSetterType = <T>(
  type: SelectedItemType,
  id: string,
  updater: T | ((c: T) => T),
) => T;
