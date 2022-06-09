import type { Node, DraggerData, NodeAtom } from '@lib/types';
import type ItemActives from './itemActives';
import type TailCore from '..';

import { createNodeDeltaMove } from '../mutation';

class NodeMoves {
  constructor(private core: TailCore, private itemActives: ItemActives) {}
  node: Record<string, string> = {};

  onDragStart = (e: React.MouseEvent, n: Node, c: DraggerData) => {
    return this.core.props.onDragStart?.(e, n, c);
  };

  batchNodeDrag = (e: MouseEvent, n: Node, d: DraggerData) => {
    if (!this.itemActives.activeItems.node[n.id]) {
      this.node = { [n.id]: n.id };
    } else {
      this.node = this.itemActives.activeItems.node;
    }
    if (!this.core.props.quickNodeUpdate) {
      this.batchEmitUpdate(e, n, d);
    } else {
      const updater = createNodeDeltaMove(d.deltaX, d.deltaY);
      Object.keys(this.node).forEach((e: string) => {
        this.core.setAtomState('node', e, updater);
      });
    }
    this.core.props.onDrag?.(e, n, d);
  };

  batchNodeDragEnd = (e: MouseEvent, n: Node, d: DraggerData) => {
    this.batchEmitUpdate(e, n, d);
    this.core.props.onDragEnd?.(e, n, d);
  };

  private batchEmitUpdate = (e: MouseEvent, n: Node, d: DraggerData) => {
    const updater = createNodeDeltaMove(d.deltaX, d.deltaY);
    const updatePayload: Node[] = [];
    Object.keys(this.node).forEach((e: string) => {
      const nodeState = this.core.getAtomState<NodeAtom>('node', e);
      nodeState && updatePayload.push(updater(nodeState).node);
    });
    this.core.props.onNodeUpdate?.(updatePayload);
  };
}

export default NodeMoves;
