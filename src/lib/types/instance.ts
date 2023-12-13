import React, { ReactNode } from 'react';
import type {
  EdgeUpdater,
  ItemSelector,
  NodeUpdater,
} from '@lib/components/ItemParser/itemUpdater';
import type { Node, NodeAtomState, NodeMouseInterface, NodeRendererProps } from './nodes';
import type {
  Edge,
  EdgeTree,
  EdgeAtomState,
  EdgeBasic,
  EdgeMouseInterface,
  MarkerDefsProps,
  MarkerTemplatesType,
  EdgePairedResult,
  EdgeRendererProps,
} from './edges';
import type { ViewerInterface, SelectModeType } from './viewer';
import type { DescriberType, HandleElement, HandleType } from './handles';
import type { coordinates } from './dragger';
import { NodeArrangeOptions } from './rearrange';

export type CoreMethods = {
  switchMode(m: SelectModeType): void;
  setScale(scale: number): void;
  focusNode(id: string): void;
  getEdgeTree(): EdgeTree;
  moveViewCenter(x: number, y: number): void;
  getOffSet(): coordinates;
  rearrangeNodes(opts?: Partial<NodeArrangeOptions>): Record<string, Node>;
};

export type TailCoreOptionalProps = {
  nodeTemplates?: NodeRendererProps['templates'];
  edgeTemplates?: EdgeRendererProps['templates'];
  markerTemplates?: MarkerTemplatesType;
  nodeTemplatePicker?: NodeRendererProps['templatePicker'];
  connectingEdge?: NonNullable<EdgeRendererProps['connectingEdge']>;
  quickNodeUpdate?: boolean;
  lazyRenderNodes?: boolean;
  // onDelete?(nodes: string[], edges: string[]): void; //come with id array
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
  activeNodes?: string[];
  activeEdges?: string[];
};

export type TailProps = ItemParserProps & TailCoreProps;

export interface NodeMutation {
  onNodeUpdate?(id: Node[]): void;
}

// type HandlePayload<T extends 'source' | 'target'> = {
//   [F in NonNullable<
//     {
//       [Key in keyof EdgeBasic]: Key extends `${T}${infer X}` ? Key : never;
//     }[keyof EdgeBasic]
//   >]: EdgeBasic[F];
// };

export type HandleAttribute = {
  handleId: string;
  nodeId: string;
  describer?: DescriberType;
};

export interface EdgeMutation {
  onEdgeCreate?(edgeBasic: EdgeBasic, pairedStatus: EdgePairedResult | null): void;
  /**
   * trigger when rewiring an edge
   * @param id previous edge id
   * @param edgeBasic next edge instance object
   */
  onEdgeUpdate?(id: string, edgeBasic: EdgeBasic, pairedStatus: EdgePairedResult | null): void;
  /**
   * when connecting two handles, an eligible edge is ready to be created if two handles
   * are in the pair (type `source` to type `target`) before user releasing the mouse,
   * the connecting edge under such condition will call the `onEdgePaired` callback,
   * and the returned result in type of `EdgePairedResult` will be set to the `pairedStatus`
   * in the props of `EdgeInProgress` Component.
   *
   * if the callback is not provided/ or no explicit value is returned,
   * a default value `EdgePairedResult.allow` wil be applied
   * @param sourceHandle
   * @param targetHandle
   */
  onEdgePaired?(sourceHandle: HandleAttribute, targetHandle: HandleAttribute): EdgePairedResult;
}

export type HandleMap = {
  [handleId: string]: HandleElement;
};

export type HandlesInfo = {
  source: HandleMap;
  target: HandleMap;
};

export interface GeneralMethods {
  getScale(): number;
}
export type ConnectMethodType = (
  e: React.MouseEvent,
  type: HandleType,
  nodeId: string,
  handleId: string,
  desciber?: Record<string, any>,
) => void;
export interface InterfaceValue extends GeneralMethods {
  edge: EdgeMouseInterface;
  node: NodeMouseInterface;
  handle: HandleInterface;
}
export interface HandleInterface {
  onMouseDown: ConnectMethodType;
  onMouseUp: ConnectMethodType;
  onMouseEnter: ConnectMethodType;
  onMouseLeave: ConnectMethodType;
}

export type UpdaterType<T> = T | ((currVal: T) => T);

export type NodesAtomState = Record<string, NodeAtomState>;

export type ItemParserInterface = {
  nodeUpdater: NodeUpdater;
  edgeUpdater: EdgeUpdater;
  nodeSelector: ItemSelector<NodeAtomState>;
  edgeSelector: ItemSelector<EdgeAtomState>;
  getSnapshot: () => {
    edgeTree: EdgeTree;
    nodesAtomState: NodesAtomState;
    edgesAtomState: Record<string, EdgeAtomState>;
  };
};
