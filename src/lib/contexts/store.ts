import { createContext } from 'react';
import { StoreRootInterface } from '@app/types';

export const StoreContext = createContext<StoreRootInterface | null>(null);
export const StoreProvider = StoreContext.Provider;
export const StoreConsumer = StoreContext.Consumer;
