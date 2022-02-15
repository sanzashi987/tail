import { Edge } from '@app/types';
import { atom, selectorFamily } from 'recoil';



export function createEdgeAtom(id: string, edge: Edge) {
  return atom({
    key: `${id}__edge`,
    default: {
      edge,
      selected: false,
      forceRender: 0
    }
  })
}
export const EdgeWrapperSelector = selectorFamily({
  key: 'edgeWrapperSelector',
  get: () => {

  },
  set: () => {

  }
})

