import type { coordinates } from '.';

type SelectModeType = 'single' | 'select';
export type InfiniteViewerState = {
  scale: number;
  offset: coordinates;
  selectMode: SelectModeType;
};

export type InfiniteViewerProps = {
  deactivateAll(): void;
};
