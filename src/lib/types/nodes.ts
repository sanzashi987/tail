/* eslint-disable @typescript-eslint/ban-types */
import type { ComponentType } from 'react';
import { JotaiImmerAtom } from './jotai';
import type { HandlesInfo, coordinates, AtomForceRender, DraggerData, Rect } from '.';

export type Node<T extends Record<string, any> = {}> = {
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

export type NodeTemplatesType = Record<string, TemplateNodeClass>;

export type NodeCom<T extends Record<string, any> = {}> = ComponentType<NodeProps<T>>;

export type TemplateNodeClass = Record<string, NodeCom<any>>;

export type TemplatePickerType = (node: Node<any>) => [string, string];

export type NodeRendererProps = {
  templates: Record<string, TemplateNodeClass>;
  templatePicker: TemplatePickerType;
};

export type NodeAtomType<T extends Record<string, any> = {}> = JotaiImmerAtom<NodeAtom<T>>;

export type NodeWrapperProps<T extends Record<string, any> = {}> = {
  atom: NodeAtomType<T>;
  templates: Record<string, TemplateNodeClass>;
  templatePicker: TemplatePickerType;
};

export type Nodes = Record<string, Node>;

export type NodeProps<T extends Record<string, any> = {}> = {
  node: Node<T>;
  selected: boolean;
  hovered: boolean;
  selectedHandles: Record<string, number>;
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

export type NodeAtomRaw<T extends Record<string, any> = {}> = Omit<
  NodeProps<T>,
  'updateNodeHandles'
> & {
  handles: HandlesInfo;
  rect: Rect;
};

export type NodeAtom<T extends Record<string, any> = {}> = NodeAtomRaw<T> & AtomForceRender;

export type NodeAtomsType = Record<string, JotaiImmerAtom<NodeAtom>>;
