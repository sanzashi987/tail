import React, { FC, useEffect, useRef } from 'react';
import { DifferProvider } from '@lib/contexts/differ';
import type { ItemParserProps } from '@lib/types';
import { useAtomSetter } from '@lib/hooks/jotai';
import { EdgeUpdater, NodeUpdater } from './itemUpdater';

const ItemParser: FC<ItemParserProps> = ({ nodes, edges, children }) => {
  const atomSetter = useAtomSetter();
  const differ = useRef({
    nodeUpdater: new NodeUpdater(atomSetter, nodes),
    edgeUpdater: new EdgeUpdater(atomSetter, edges),
  });

  useEffect(() => {
    differ.current.nodeUpdater.diff(nodes);
  }, [nodes]);
  useEffect(() => {
    differ.current.edgeUpdater.diff(edges);
  }, [edges]);
  return <DifferProvider value={differ.current}>{children}</DifferProvider>;
};

export default ItemParser;
