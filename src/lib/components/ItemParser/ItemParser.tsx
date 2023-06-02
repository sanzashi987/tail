import React, { FC, useEffect, useMemo, useRef } from 'react';
import { ParserProvider } from '@lib/contexts/parser';
import type { ItemParserProps } from '@lib/types';
import { useAtomGetter, useAtomSetter } from '@lib/hooks/jotai';
import { EdgeUpdater, ItemSelector, NodeUpdater } from './itemUpdater';

const defaultSet = new Set<string>();

const ItemParser: FC<ItemParserProps> = ({ nodes, edges, activeEdges, activeNodes, children }) => {
  const atomSetter = useAtomSetter();
  const atomGetter = useAtomGetter();

  const activeNodesSet = useRef<Set<string>>(defaultSet);
  const activeEdgesSet = useRef<Set<string>>(defaultSet);

  const parserContext = useMemo(() => {
    const nodeUpdater = new NodeUpdater(atomGetter, atomSetter, activeNodesSet);
    const edgeUpdater = new EdgeUpdater(atomGetter, atomSetter, activeEdgesSet);
    const nodeSelector = new ItemSelector(nodeUpdater.setState);
    const edgeSelector = new ItemSelector(edgeUpdater.setState);
    return { nodeUpdater, edgeUpdater, nodeSelector, edgeSelector };
  }, []);

  useEffect(() => {
    activeNodesSet.current = new Set(activeNodes!);
    parserContext.nodeSelector.diff(activeNodes!);
  }, [activeNodes]);
  useEffect(() => {
    activeEdgesSet.current = new Set(activeEdges!);
    parserContext.edgeSelector.diff(activeEdges!);
  }, [activeEdges]);
  useEffect(() => {
    parserContext.nodeUpdater.diff(nodes);
  }, [nodes]);
  useEffect(() => {
    parserContext.edgeUpdater.diff(edges);
  }, [edges]);

  return <ParserProvider value={parserContext}>{children}</ParserProvider>;
};

ItemParser.defaultProps = {
  activeEdges: [],
  activeNodes: [],
};

export default ItemParser;
