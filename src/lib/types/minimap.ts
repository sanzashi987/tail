import type { CSSProperties } from 'react';
import type { RecoilState } from 'recoil';
import { Box, NodeAtom } from '.';

export type MinimapProps = {
  height?: number;
  width?: number;
  activeColor?: string;
  nodeColor?: string;
  // padding?: number;
  style?: CSSProperties;
  viewportFrameColor?: string;
};

export type MinimapState = {
  sortedX: number[];
  sortedY: number[];
};

export type MiniNodeProps = {
  atom: RecoilState<NodeAtom>;
  activeColor: string;
  nodeColor: string;
  updateBox(box: Box, lastBox?: Box): void;
};
