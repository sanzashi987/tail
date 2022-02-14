import { Node } from '@app/types'
import { atom, selectorFamily } from 'recoil'



export function createNodeAtom<T>(node: Node<T>) {
  return atom({
    key: `${node.id}__node`,
    default: {
      node,
      selected: false,
      selectedHandles: [],
      handles: {
        source: {},
        target: {}
      }
    }
  })
}