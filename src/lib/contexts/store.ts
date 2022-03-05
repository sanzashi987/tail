import { StoreRootInterface } from '@app/types';
import { createContext } from 'react';

export const StoreContext = createContext<StoreRootInterface | null>(null);
export const StoreProvider = StoreContext.Provider;
export const StoreConsumer = StoreContext.Consumer;
