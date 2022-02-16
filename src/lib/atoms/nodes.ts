import type { Node, NodeAtom } from '@app/types'
import { atom, RecoilState } from 'recoil'



export function createNodeAtom<T>(node: Node<T>) {
  return atom<NodeAtom<T>>({
    key: `${node.id}__node`,
    default: {
      node,
      selected: false,
      selectedHandles: [],
      handles: {
        source: {},
        target: {}
      },
      forceRender: 0
    }
  })
}
