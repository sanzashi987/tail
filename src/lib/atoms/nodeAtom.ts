import { Node } from '@app/types'
import { atom } from 'recoil'



function createNodeAtom(id: string, node: Node) {

  return atom({
    key: id,
    default: {
      node,
      selected: false,
      selectedHandles: []
    }
  })
}