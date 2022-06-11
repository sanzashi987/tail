import React, { ComponentType, ReactNode } from 'react';
import { EdgeUpdater, ItemSelector, NodeUpdater } from '@lib/components/ItemParser/itemUpdater';
import {
  Node,
  NodeAtomState,
  NodeMouseInterface,
  NodeTemplatesType,
  TemplatePickerType,
} from './nodes';
import {
  Edge,
  EdgeBasicProps,
  EdgeTree,
  EdgeAtomState,
  EdgeBasic,
  EdgeMouseInterface,
  MarkerDefsProps,
  EdgeTemplatesType,
  MarkerTemplatesType,
} from './edges';
import type { ViewerInterface, SelectModeType } from './viewer';
import type { HandleElement, HandleType } from './handles';
import type { MouseEventCollection } from './dragger';

export type CoreMethods = {
  switchMode(m: SelectModeType): void;
  setScale(scale: number): void;
  focusNode(id: string): void;
  getEdgeTree(): EdgeTree;
  moveViewCenter(x: number, y: number): void;
};

export type TailCoreOptionalProps = {
  nodeTemplates?: NodeTemplatesType;
  edgeTemplates?: EdgeTemplatesType;
  markerTemplates?: MarkerTemplatesType;
  nodeTemplatePicker?: TemplatePickerType;
  connectingEdge?: ComponentType<EdgeBasicProps>;
  quickNodeUpdate?: boolean;
  lazyRenderNodes?: boolean;
  onDelete?(nodes: string[], edges: string[]): void; //come with id array
  onActivate?: ActiveNextType;
  onSelect?(e: MouseEvent, nodes: string[]): void;
} & NodeMutation &
  EdgeMutation &
  NodeMouseInterface &
  EdgeMouseInterface &
  ViewerInterface &
  MarkerDefsProps;

export type TailCoreProps = {
  children?: ReactNode;
} & NodeMouseInterface &
  EdgeMouseInterface &
  TailCoreOptionalProps;

export type ItemParserProps = {
  nodes: Record<string, Node>;
  edges: Record<string, Edge>;
  activeNodes: string[];
  activeEdges: string[];
};

export type TailProps = ItemParserProps & TailCoreProps;

export interface NodeMutation {
  onNodeUpdate?(id: Node[]): void;
}

export interface EdgeMutation {
  onEdgeCreate?(edgeBasic: EdgeBasic): void;
  onEdgeUpdate?(id: string, edgeBasic: EdgeBasic): void;
}

export type HandleMap = {
  [handleId: string]: HandleElement;
};

export type HandlesInfo = {
  source: HandleMap;
  target: HandleMap;
};

export type ActiveNextType = (
  e: MouseEventCollection | null,
  type: 'node' | 'edge',
  id: string,
  selected: boolean,
  force?: boolean,
) => void;
export interface GeneralMethods {
  activateItem: ActiveNextType;
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

export type UpdaterType<T> = T | ((currVal: T) => T);

export type ItemParserInterface = {
  nodeUpdater: NodeUpdater;
  edgeUpdater: EdgeUpdater;
  nodeSelector: ItemSelector<NodeAtomState>;
  edgeSelector: ItemSelector<EdgeAtomState>;
};
