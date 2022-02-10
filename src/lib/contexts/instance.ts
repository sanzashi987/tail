import { createContext } from 'react';
import type { InterfaceValue, NodeInternals } from '@types'

export type StateValue = {
  source: string
  sourceNode: string
  nodeInternals: NodeInternals
}

export const defaultState: StateValue = {
  source: '',
  sourceNode: '',
  nodeInternals: new Map()
}


export const InstanceState = createContext<StateValue>(defaultState);
export const StateProvider = InstanceState.Provider;
export const StateConsumer = InstanceState.Consumer;

// export default ConnectingContext;



export type ConnectedPayload = {
  target: string
  targetNode: string
}



const defaultInterface: InterfaceValue = {
  startConnecting() { },
  onConnected() { },
  startReconnecting() { }
}

export const InstanceInterface = createContext<InterfaceValue>(defaultInterface)
export const InterfaceProvider = InstanceInterface.Provider
export const InterfaceConsumer = InstanceInterface.Consumer


