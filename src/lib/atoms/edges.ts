import { Edge, EdgeAtom } from '@app/types';
import { atom, selectorFamily } from 'recoil';



export function createEdgeAtom(edge: Edge) {
  return atom<EdgeAtom>({
    key: `${edge.id}__edge`,
    default: {
      edge,
      selected: false,
      forceRender: 0
    }
  })
}
export const ComputedEdgeState = selectorFamily({
  key: 'edgeWrapperSelector',
  get: () => {

  },
  set: () => {

  }
})

