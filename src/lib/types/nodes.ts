/* eslint-disable @typescript-eslint/ban-types */
import { Component, ComponentType } from 'react';
import type { RecoilState } from 'recoil';
import type { HandlesInfo } from './instance';
import type { coordinates, AtomForceRender, DraggerInterface, DraggerData } from '.';

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

export type NodeRendererProps = {
  nodes: IObject<Node>;
  foldable?: boolean;
  templates?: IObject<TemplateNodeClass>;
  templatePicker?: (node: Node) => [string, string];
  mounted(): void;
};

export type NodeWrapperProps<T extends IObject = {}> = {
  atom: RecoilState<NodeAtom<T>>;
  // atom: RecoilState<NodeAtom>;
  templates: IObject<TemplateNodeClass>;
  templatePicker: (node: Node) => [string, string];
};

export type Nodes = NodeRendererProps['nodes'];

export type NodeProps<T extends IObject = {}> = {
  node: Node<T>;
  selected: boolean;
  selectedHandles: IObject<number>;
  updateNodeHandles(): void;
};

export interface NodeMouseInterface extends WrapperDraggerInterface {
  onNodeClick: (e: React.MouseEvent, node: Node) => void;
}

export type WrapperDraggerInterface = DraggerCallbacksType;

export type TailNodeDraggerCallback = (
  e: MouseEventCollection,
  n: Node,
  c: DraggerData,
) => boolean | void;

export type DraggerCallbacksType = {
  [key in keyof DraggerInterface]?: TailNodeDraggerCallback;
};

export type NodeAtomRaw<T extends IObject = {}> = Omit<NodeProps<T>, 'updateNodeHandles'> & {
  handles: HandlesInfo;
};

export type NodeAtom<T extends IObject = {}> = NodeAtomRaw<T> & AtomForceRender;
// export type NodeAtom = NodeAtomRaw & AtomForceRender;

export type NodeAtomsType = IObject<RecoilState<NodeAtom>>;
