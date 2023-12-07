import { useContext, useEffect } from 'react';
import type { JotaiSetStateAction, NodeAtomState } from '@lib/types';
import { ZeroPositionNodeAtom } from '@lib/atoms/nodes';
import { ParserContext } from '@lib/contexts';
import { useAtomValue } from 'jotai';

const useNodePosition = (
  nodeState: NodeAtomState,
  setNodeInternal: JotaiSetStateAction<NodeAtomState>,
) => {
  const { node, runtimePosition } = nodeState;
  const { nodeUpdater } = useContext(ParserContext)!;
  const { runtimePosition: parentPosition } = useAtomValue(
    nodeUpdater.getAtoms()[node.parent ?? ''] ?? ZeroPositionNodeAtom,
  );

  const { left, top } = node;

  useEffect(() => {
    const runtimeX = left + parentPosition.x;
    const runtimeY = top + parentPosition.y;
    if (runtimeX !== runtimePosition.x || runtimeY !== runtimePosition.y) {
      setNodeInternal((last) => {
        last.runtimePosition = { x: runtimeX, y: runtimeY };
      });
    }
  }, [left, top, runtimePosition, parentPosition]);

  return {
    x: left,
    y: top,
    absX: runtimePosition.x,
    absY: runtimePosition.y,
  };
};

export default useNodePosition;
