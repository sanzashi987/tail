import React from 'react';
import type { coordinates } from '.';

export type SelectModeType = 'single' | 'select';

export type InfiniteViewerState = {
  scale: number;
  offset: coordinates;
  selectMode: SelectModeType;
  selecting: boolean;
  dragStart: coordinates;
  dragEnd: coordinates;
};

export type SelectCallback = (
  start: coordinates,
  end: coordinates,
  offset: coordinates,
  scale: number,
) => void;

export type InfiniteViewerProps = {
  onClick?(e: React.MouseEvent): void;
  onSelecting?: SelectCallback;
  onSelectEnd?: SelectCallback;
};

export type SelectAreaProps = {
  dragStart: coordinates;
  dragEnd: coordinates;
  offset: coordinates;
  offsetSnap: coordinates;
};
