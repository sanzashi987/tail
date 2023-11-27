import React, { FC, useEffect, useMemo, useRef } from 'react';
import { ParserProvider } from '@lib/contexts/parser';
import type { ItemParserProps } from '@lib/types';
import { atomGetter, atomSetter } from '@lib/store';
// import { useAtomGetter, useAtomSetter } from '@lib/hooks/jotai';
import { EdgeUpdater, ItemSelector, NodeUpdater } from './itemUpdater';

const defaultSet = new Set<string>();

const ItemParser: FC<ItemParserProps> = ({ nodes, edges, activeEdges, activeNodes, children }) => {
  // const atomGetter = useAtomGetter();
  // const atomSetter = useAtomSetter();

  const activeNodesSet = useRef(defaultSet);
  const activeEdgesSet = useRef(defaultSet);

  const parserContext = useMemo(() => {
    const nodeUpdater = new NodeUpdater(atomGetter, atomSetter, activeNodesSet);
    const edgeUpdater = new EdgeUpdater(atomGetter, atomSetter, activeEdgesSet);
    const nodeSelector = new ItemSelector(nodeUpdater.setState);
    const edgeSelector = new ItemSelector(edgeUpdater.setState);

    const getSnapshot = () => {
      const nodeAtoms = nodeUpdater.getAtoms();
      const edgeAtoms = edgeUpdater.getAtoms();
      const edgeTree = edgeUpdater.edgeTree;

      return {
        edgeTree,
        nodesAtomState: Object.fromEntries(
          Object.entries(nodeAtoms).map(([k, v]) => [k, atomGetter(v)]),
        ),
        edgesAtomState: Object.fromEntries(
          Object.entries(edgeAtoms).map(([k, v]) => [k, atomGetter(v)]),
        ),
      };
    };

    return { nodeUpdater, edgeUpdater, nodeSelector, edgeSelector, getSnapshot };
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
