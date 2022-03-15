import { createContext } from 'react';
import type { InterfaceValue } from '@types';
// export default ConnectingContext;

export const InstanceInterface = createContext<InterfaceValue | null>(null);
InstanceInterface.displayName = 'InstanceInterface';
export const InterfaceProvider = InstanceInterface.Provider;
export const InterfaceConsumer = InstanceInterface.Consumer;
