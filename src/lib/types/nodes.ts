/* eslint-disable @typescript-eslint/ban-types */
import type { ComponentType } from 'react';
import { JotaiImmerAtom } from './jotai';
import type { HandlesInfo, coordinates, AtomForceRender, DraggerData, Rect, IObject } from '.';

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

export type TemplateNodeClass = IObject<NodeCom<any>>;

export type TemplatePickerType = (node: Node<any>) => [string, string];

export type NodeRendererProps = {
  templates: IObject<TemplateNodeClass>;
  templatePicker: TemplatePickerType;
};

export type NodeAtomType<T extends IObject = {}> = JotaiImmerAtom<NodeAtom<T>>;

export type NodeWrapperProps<T extends IObject = {}> = {
  atom: NodeAtomType<T>;
  templates: IObject<TemplateNodeClass>;
  templatePicker: TemplatePickerType;
};

export type Nodes = IObject<Node>;

export type NodeProps<T extends IObject = {}> = {
  node: Node<T>;
  selected: boolean;
  hovered: boolean;
  selectedHandles: IObject<number>;
  updateNodeHandles(): void;
};

export interface NodeMouseInterface extends DraggerCallbacksType {
  onNodeClick?: (e: MouseEvent, node: Node) => void;
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

export type NodeAtomsType = IObject<JotaiImmerAtom<NodeAtom>>;
