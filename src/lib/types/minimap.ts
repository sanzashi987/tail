import type { CSSProperties } from 'react';
import type { RecoilState } from 'recoil';
import { NodeAtom } from '.';

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
  setSpanX: (xStart: number, xEnd: number, lastXStart?: number, lastXEnd?: number) => void;
  setSpanY: (yStart: number, yEnd: number, lastYStart?: number, lastYEnd?: number) => void;
};
