import { createContext } from 'react';
import type { InterfaceValue, Node, NodeInternals } from '@types'

export type StateValue = {
  source: string
  sourceNode: string
  sourceNodeConfig?: Node
  // nodeInternals: NodeInternals
} | null



export const InstanceState = createContext<StateValue>(null);
export const StateProvider = InstanceState.Provider;
export const StateConsumer = InstanceState.Consumer;

// export default ConnectingContext;



export type ConnectedPayload = {
  target: string
  targetNode: string
}


export const InstanceInterface = createContext<InterfaceValue | null>(null)
export const InterfaceProvider = InstanceInterface.Provider
export const InterfaceConsumer = InstanceInterface.Consumer


