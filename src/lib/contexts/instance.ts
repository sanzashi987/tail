import { createContext } from 'react';
import type { HandleType, NodeInternals } from '@types'

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


export type InterfaceMethodType = (nodeId: string, handleId: string) => void




export interface InterfaceValue {
  startConnecting: InterfaceMethodType
  onConnected: InterfaceMethodType
  startReconnecting: InterfaceMethodType
}

const defaultInterface: InterfaceValue = {
  startConnecting() { },
  onConnected() { },
  startReconnecting() { }
}

export const InstanceInterface = createContext<InterfaceValue>(defaultInterface)
export const InterfaceProvider = InstanceInterface.Provider
export const InterfaceConsumer = InstanceInterface.Consumer


