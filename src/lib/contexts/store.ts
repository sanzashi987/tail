import { createContext } from 'react';
import { StoreRootInterface } from '@app/types';

export const StoreContext = createContext<StoreRootInterface | null>(null);
StoreContext.displayName = 'StoreContext';
export const StoreProvider = StoreContext.Provider;
export const StoreConsumer = StoreContext.Consumer;