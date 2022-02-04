import { createContext } from 'react';
import type { HandleType } from '@types'

export type ConnectingStateValue = {
  source: string
  sourceNode: string
}

export const defaultState: ConnectingStateValue = {
  source: '',
  sourceNode: '',
}


export const ConnectingState = createContext<ConnectingStateValue>(defaultState);
export const StateProvider = ConnectingState.Provider;
export const StateConsumer = ConnectingState.Consumer;

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

export const ConnectingInterface = createContext<InterfaceValue>(defaultInterface)
export const InterfaceProvider = ConnectingInterface.Provider
export const InterfaceConsumer = ConnectingInterface.Consumer


