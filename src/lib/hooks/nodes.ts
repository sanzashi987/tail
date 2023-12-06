import { useContext } from 'react';
import { ParserContext } from '@lib/contexts';
import { Node } from '@lib/types';
import { useAtomValue } from 'jotai';
import { DummyNodeAtom } from '@lib/atoms/nodes';

const useNodePosition = (node: Node) => {
  const { nodeUpdater } = useContext(ParserContext)!;
  const parentNodeState = useAtomValue(DummyNodeAtom);
};
