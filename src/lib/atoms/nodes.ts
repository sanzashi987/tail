import { Node } from '@app/types'
import { atom } from 'recoil'



export function createNodeAtom(id: string, node: Node) {
  return atom({
    key: `${id}__node`,
    default: {
      node,
      selected: false,
      selectedHandles: []
    }
  })
}