import type { RecoilState } from 'recoil';
import { NodeAtom } from '.';

export type MinimapProps = {
  height?: number;
  width?: number;
  backgroundColor?: string;
  activeColor?: string;
  nodeColor?: string;
  viewWidth: number;
  viewHeight: number;
  scale: number;
};

export type MiniNodeProps = {
  atom: RecoilState<NodeAtom>;
  activeColor: string;
  nodeColor: string;
};
