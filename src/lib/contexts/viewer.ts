import { createContext } from 'react';
import type { ViewerContextType } from '@app/types';
import { noop } from '@app/utils/converter';

export const defaultVal: ViewerContextType = {
  offset: { x: NaN, y: NaN },
  viewerHeight: NaN,
  viewerWidth: NaN,
  scale: NaN,
  setOffset: noop,
};

export const ViewerContext = createContext<ViewerContextType>(defaultVal);
ViewerContext.displayName = 'ViewerContext';
export const ViewerProvider = ViewerContext.Provider;
export const ViewerConsumer = ViewerContext.Consumer;
