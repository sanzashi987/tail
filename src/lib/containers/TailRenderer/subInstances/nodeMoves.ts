import type { Node, DraggerData } from '@lib/types';
import type TailCore from '..';

import { createNodeDeltaMove } from '../mutation';

class NodeMoves {
  constructor(private core: TailCore) {}

  batchNodeDragStart = (e: MouseEvent, n: Node, d: DraggerData) => {
    this.core.props.onDragStart?.(e, n, d);
  };

  batchNodeDrag = (e: MouseEvent, n: Node, d: DraggerData) => {
    if (!this.core.props.quickNodeUpdate) {
      this.batchEmitUpdate(e, n, d);
    } else {
      const updater = createNodeDeltaMove(d.deltaX, d.deltaY);
      Object.keys(this.node).forEach((e: string) => {
        this.core.context.nodeUpdater.setState(e, updater);
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
      const nodeState = this.core.context.nodeUpdater.getState(e);
      nodeState && updatePayload.push(updater(nodeState).node);
    });
    this.core.props.onNodeUpdate?.(updatePayload);
  };
}

export default NodeMoves;
