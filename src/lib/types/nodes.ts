/* eslint-disable @typescript-eslint/ban-types */
import type { ComponentType } from 'react';
import type { RecoilState } from 'recoil';
import type { HandlesInfo } from './instance';
import type { coordinates, AtomForceRender, DraggerInterface } from '.';

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
  selectedHandles: IObject<string>;
  updateNodeInternal(): void;
};

export interface NodeMouseInterface extends WrapperDraggerInterface {
  onNodeClick?: (e: React.MouseEvent, node: Node) => void;
}

export type DraggerCallbacksType = {
  [key in keyof DraggerInterface]?: (
    e: MouseEventCollection,
    n: Node,
    c: coordinates,
  ) => boolean | void;
};

export interface WrapperDraggerInterface extends DraggerCallbacksType {}

export type NodeAtomRaw<T extends IObject = {}> = Omit<NodeProps<T>, 'updateNodeInternal'> & {
  handles: HandlesInfo;
};

export type NodeAtom<T extends IObject = {}> = NodeAtomRaw<T> & AtomForceRender;
// export type NodeAtom = NodeAtomRaw & AtomForceRender;

export type NodeAtomsType = IObject<RecoilState<NodeAtom>>;
