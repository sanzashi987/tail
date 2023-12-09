import { useCallback, useContext, useMemo } from 'react';
import { ParserContext } from '@lib/contexts';
import { NodeAtomState } from '@lib/types';

const disguiseHandle = (nodeState: NodeAtomState, handle: string) => {};

const useDisguiseChildren = (nodeState: NodeAtomState) => {
  const { nodeUpdater, edgeUpdater } = useContext(ParserContext)!;
  const nodeTree = useMemo(() => nodeUpdater.getNodeTree(), []);
  const edgeTree = useMemo(() => edgeUpdater.edgeTree, []);

  const getOpenLoopHandle = useCallback(() => {
    const children = nodeTree.get(nodeState.node.id);
    const handleMap = { source: {}, target: {} };
    children?.forEach((nodeId) => {
      edgeTree.get(nodeId)?.forEach((handleId, key, map) => {
        handleId.
      });
    });
  }, []);

  const disguiseHandle = useCallback((childrenId: string, handle: string) => {
    const myChildren = nodeTree.get(nodeState.node.id);
    const atoms = nodeUpdater.getAtoms();
  }, []);
};
