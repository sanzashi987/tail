import { createContext } from 'react';
import type { ItemDifferInterface } from '@lib/types';
// export default ConnectingContext;

export const DifferContext = createContext<ItemDifferInterface | null>(null);
DifferContext.displayName = 'DifferContext';
export const DifferProvider = DifferContext.Provider;
export const DifferConsumer = DifferContext.Consumer;
