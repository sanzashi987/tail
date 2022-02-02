
import { createContext } from 'react';

type ContextProps = {}


export const InstanceContext = createContext<ContextProps>({});
export const Provider = InstanceContext.Provider;
export const Consumer = InstanceContext.Consumer;

export default InstanceContext;

