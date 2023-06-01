import React, { FC, useEffect, useMemo } from 'react';
import { ParserProvider } from '@lib/contexts/parser';
import type { ItemParserProps } from '@lib/types';
import { useAtomGetter, useAtomSetter } from '@lib/hooks/jotai';
import { EdgeUpdater, ItemSelector, NodeUpdater } from './itemUpdater';

const ItemParser: FC<ItemParserProps> = ({ nodes, edges, activeEdges, activeNodes, children }) => {
  const atomSetter = useAtomSetter();
  const atomGetter = useAtomGetter();
  const parserContext = useMemo(() => {
    const nodeUpdater = new NodeUpdater(atomGetter, atomSetter);
    const edgeUpdater = new EdgeUpdater(atomGetter, atomSetter);
    const nodeSelector = new ItemSelector(nodeUpdater.setState);
    const edgeSelector = new ItemSelector(edgeUpdater.setState);
    return { nodeUpdater, edgeUpdater, nodeSelector, edgeSelector };
  }, []);

  useEffect(() => {
    parserContext.nodeUpdater.diff(nodes);
  }, [nodes]);
  useEffect(() => {
    parserContext.edgeUpdater.diff(edges);
  }, [edges]);
  useEffect(() => {
    parserContext.nodeSelector.diff(activeNodes!);
  }, [activeNodes]);
  useEffect(() => {
    parserContext.edgeSelector.diff(activeEdges!);
  }, [activeEdges]);

  return <ParserProvider value={parserContext}>{children}</ParserProvider>;
};

ItemParser.defaultProps = {
  activeEdges: [],
  activeNodes: [],
};

export default ItemParser;
