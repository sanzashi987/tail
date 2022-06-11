import type { Node, DraggerData, NodeAtomState } from '@lib/types';
import type TailCore from '..';

function createNodeDeltaMove(deltaX: number, deltaY: number) {
  return function (prev: NodeAtomState): NodeAtomState {
    return {
      ...prev,
      node: {
        ...prev.node,
        left: prev.node.left + deltaX,
        top: prev.node.top + deltaY,
      },
    };
  };
}

class NodeMoves {
  constructor(private core: TailCore) {}
  private nodes: Set<string> = new Set();
  batchNodeDragStart = (e: MouseEvent, n: Node, d: DraggerData) => {
    this.nodes = new Set(this.core.context.nodeSelector.currentItems);
    this.core.props.onDragStart?.(e, n, d);
  };

  batchNodeDrag = (e: MouseEvent, n: Node, d: DraggerData) => {
    if (!this.core.props.quickNodeUpdate) {
      this.batchEmitUpdate(e, n, d);
    } else {
      const updater = createNodeDeltaMove(d.deltaX, d.deltaY);
      this.nodes.forEach((e: string) => {
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
    this.nodes.forEach((e: string) => {
      const nodeState = this.core.context.nodeUpdater.getState(e);
      nodeState && updatePayload.push(updater(nodeState).node);
    });
    this.core.props.onNodeUpdate?.(updatePayload);
  };
}

export default NodeMoves;
