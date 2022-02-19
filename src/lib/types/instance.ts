import type {
  HandleElement,
  Node,
  coordinates,
  DraggerInterface,
  Edge,
  TemplateNodeClass,
  EdgeTemplatesType,
  NodeTemplatesType,
  MarkerTemplatesType,
} from '.';
import { RecoilValue, RecoilState } from 'recoil';
import { NodeMouseInterface } from './nodes';
import { EdgeMouseInterface } from './edges';

export type TailRendererProps = {
  nodes: IObject<Node>;
  edges: IObject<Edge>;
  nodeTemplates?: NodeTemplatesType;
  edgeTemplates?: EdgeTemplatesType;
  markerTemplates?: MarkerTemplatesType;
} & NodeMouseInterface &
  EdgeMouseInterface;

export type SelectedItemPayload = Node | Edge;

export type SelectedItemType = 'node' | 'edge';

export type SelectedItemCollection = IObject<{
  value: SelectedItemPayload;
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
  activateItem(e: React.MouseEvent, type: SelectedItemType, item: SelectedItemPayload): void;
}
export type ConnectMethodType = (nodeId: string, handleId: string) => void;
export interface InterfaceValue extends GeneralMethods {
  edge: EdgeMouseInterface;
  node: NodeMouseInterface;
}
export interface ConnectInterface {
  startConnecting: ConnectMethodType;
  onConnected: ConnectMethodType;
  startReconnecting: ConnectMethodType;
}

type MouseEventCollection = React.MouseEvent | MouseEvent;

export interface RecoilNexusInterface {
  get: <T>(atom: RecoilValue<T>) => T;
  getPromise: <T>(atom: RecoilValue<T>) => Promise<T>;
  set: <T>(atom: RecoilState<T>, valOrUpdater: T | ((currVal: T) => T)) => void;
  reset: (atom: RecoilState<any>) => void;
}

export type AtomForceRender = {
  forceRender: number;
};
