import TailCore from '..';
import type { MouseEventCollection, Node, DraggerData, NodeAtom } from '@types';
import { createNodeDeltaMove } from '../mutation';

class NodeMoves {
  constructor(private core: TailCore) {}

  batchNodeDrag = (e: MouseEventCollection, n: Node, d: DraggerData) => {
    if (!this.core.props.quickNodeUpdate) {
      this.batchEmitUpdate(e, n, d);
    } else {
      const updater = createNodeDeltaMove(d.deltaX, d.deltaY);
      Object.keys(this.core.activeItems.node).forEach((e: string) => {
        this.core.setAtomState('node', e, updater);
      });
    }
    this.core.props.onDrag?.(e, n, d);
  };

  batchNodeDragEnd = (e: MouseEventCollection, n: Node, d: DraggerData) => {
    this.batchEmitUpdate(e, n, d);
    this.core.props.onDragEnd?.(e, n, d);
  };

  private batchEmitUpdate = (e: MouseEventCollection, n: Node, d: DraggerData) => {
    const updater = createNodeDeltaMove(d.deltaX, d.deltaY);
    const updatePayload: Node[] = [];
    Object.keys(this.core.activeItems.node).forEach((e: string) => {
      updatePayload.push(updater(this.core.getAtomState<NodeAtom>('node', e)).node);
    });
    this.core.props.onNodeUpdate(updatePayload);
  };
}

export default NodeMoves;
