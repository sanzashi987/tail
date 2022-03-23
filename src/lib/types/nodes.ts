/* eslint-disable @typescript-eslint/ban-types */
import { Component, ComponentType } from 'react';
import type { RecoilState } from 'recoil';
import type {
  HandlesInfo,
  UpdaterType,
  coordinates,
  AtomForceRender,
  DraggerInterface,
  DraggerData,
  Rect,
} from '.';

export type Node<T extends IObject = {}> = {
  id: string;
  left: number;
  top: number;
  fold?: boolean;
  disable?: boolean;
  type: string;
} & T;

export type MouseEventCollection = React.MouseEvent | MouseEvent;

export type NodeMouseCallback = (e: MouseEventCollection, n: Node) => void;
export type DraggerMouseCallback = (e: MouseEventCollection, c: coordinates) => boolean | void;

export type NodeTemplatesType = IObject<TemplateNodeClass>;

export type NodeCom<T extends IObject = {}> = ComponentType<NodeProps<T>>;

export type TemplateNodeClass = IObject<NodeCom>;

export type TemplatePickerType = (node: Node) => [string, string];

export type NodeRendererProps = {
  // nodes: IObject<Node>;
  templates: IObject<TemplateNodeClass>;
  templatePicker: TemplatePickerType;
  // mounted(): void;
  // storeUpdater: (atom: RecoilState<NodeAtom>, updater: UpdaterType<NodeAtom>) => void;
};

export type NodeAtomType<T extends IObject = {}> = RecoilState<NodeAtom<T>>;

export type NodeWrapperProps<T extends IObject = {}> = {
  atom: NodeAtomType<T>;
  // atom: RecoilState<NodeAtom>;
  templates: IObject<TemplateNodeClass>;
  templatePicker: TemplatePickerType;
};

export type Nodes = IObject<Node>; // NodeRendererProps['nodes'];

export type NodeProps<T extends IObject = {}> = {
  node: Node<T>;
  selected: boolean;
  hovered: boolean;
  selectedHandles: IObject<number>;
  updateNodeHandles(): void;
};

export interface NodeMouseInterface extends DraggerCallbacksType {
  onNodeClick?: (e: React.MouseEvent, node: Node) => void;
  onNodeContextMenu?: (e: React.MouseEvent, node: Node) => void;
}

export type DraggerCallbacksType = {
  onDragStart?: (e: React.MouseEvent, n: Node, c: DraggerData) => boolean | void;
  onDrag?: (e: MouseEvent, n: Node, c: DraggerData) => boolean | void;
  onDragEnd?: (e: MouseEvent, n: Node, c: DraggerData) => boolean | void;
};

export type NodeAtomRaw<T extends IObject = {}> = Omit<NodeProps<T>, 'updateNodeHandles'> & {
  handles: HandlesInfo;
  rect: Rect;
};

export type NodeAtom<T extends IObject = {}> = NodeAtomRaw<T> & AtomForceRender;
// export type NodeAtom = NodeAtomRaw & AtomForceRender;

export type NodeAtomsType = IObject<RecoilState<NodeAtom>>;
