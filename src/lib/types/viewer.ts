import React from 'react';
import type { coordinates, UpdaterType } from '.';

export type SelectModeType = 'single' | 'select';

export type InfiniteViewerState = {
  scale: number;
  offset: coordinates;
  selectMode: SelectModeType;
  selecting: boolean;
  dragStart: coordinates;
  dragEnd: coordinates;
  viewerHeight: number;
  viewerWidth: number;
};

export type SelectCallback = (
  start: coordinates,
  end: coordinates,
  offset: coordinates,
  scale: number,
) => void;

export type ViewerDropCallback = (e: React.DragEvent, offset: coordinates, scale: number) => void;

export type InfiniteViewerProps = {
  onClick?(e: React.MouseEvent): void;
  onSelecting?: SelectCallback;
  onSelectEnd?: SelectCallback;
  onContainerResize?(width: number, height: number): void;
  outerChildren?: React.ReactNode;
} & ViewerInterface;

export type ViewerInterface = {
  onViewerDrop?: ViewerDropCallback;
  onViewerClick?: (e: React.MouseEvent, offset: coordinates, scale: number) => void;
  onViewerScale?: (scale: number) => void;
};

export type SelectAreaProps = {
  dragStart: coordinates;
  dragEnd: coordinates;
  offset: coordinates;
  offsetSnap: coordinates;
};

export type ViewerContextType = {
  offset: coordinates;
  viewerHeight: number;
  viewerWidth: number;
  scale: number;
  setOffset: (offset: UpdaterType<coordinates>) => void;
};
