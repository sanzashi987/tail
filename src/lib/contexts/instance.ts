import { createContext } from 'react';
import type { InterfaceValue } from '@types';
// export default ConnectingContext;

export type ConnectedPayload = {
  target: string;
  targetNode: string;
};

export const InstanceInterface = createContext<InterfaceValue | null>(null);
export const InterfaceProvider = InstanceInterface.Provider;
export const InterfaceConsumer = InstanceInterface.Consumer;
