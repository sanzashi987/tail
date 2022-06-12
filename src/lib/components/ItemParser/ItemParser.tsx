import React, { FC, useEffect, useMemo, useRef } from 'react';
import { ParserProvider } from '@lib/contexts/parser';
import type { ItemParserProps } from '@lib/types';
import { useAtomGetter, useAtomSetter } from '@lib/hooks/jotai';
import { EdgeUpdater, ItemSelector, NodeUpdater } from './itemUpdater';

const ItemParser: FC<ItemParserProps> = ({ nodes, edges, activeEdges, activeNodes, children }) => {
  const atomSetter = useAtomSetter();
  const atomGetter = useAtomGetter();
  const differ = useRef({
    nodeUpdater: new NodeUpdater(atomGetter, atomSetter),
    edgeUpdater: new EdgeUpdater(atomGetter, atomSetter),
  });

  const actives = useRef({
    nodeSelector: new ItemSelector(differ.current.nodeUpdater.setState),
    edgeSelector: new ItemSelector(differ.current.edgeUpdater.setState),
  });

  useEffect(() => {
    differ.current.nodeUpdater.diff(nodes);
  }, [nodes]);
  useEffect(() => {
    differ.current.edgeUpdater.diff(edges);
  }, [edges]);
  useEffect(() => {
    actives.current.nodeSelector.diff(activeNodes!);
  }, [activeNodes]);
  useEffect(() => {
    actives.current.edgeSelector.diff(activeEdges!);
  }, [activeEdges]);

  const ctx = useMemo(
    () => ({
      ...differ.current,
      ...actives.current,
    }),
    [],
  );

  return <ParserProvider value={ctx}>{children}</ParserProvider>;
};

ItemParser.defaultProps = {
  activeEdges: [],
  activeNodes: [],
};

export default ItemParser;
