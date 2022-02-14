import { Edge } from '@app/types';
import { atom } from 'recoil';



export function createEdgeAtom(id: string, edge: Edge) {
  return atom({
    key: `${id}__edge`,
    default: {
      edge,
      selected: false
    }
  })
}


