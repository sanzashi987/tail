import React, { useCallback, useState } from 'react';
import { Tail } from '@app/index';
import { coordinates, DraggerData, Edge, EdgeBasic, Node } from '@app/types';

const nodes: IObject<Node> = {
  id1: {
    id: 'id1',
    left: 10,
    top: 20,
    type: 'logical',
  },
  id2: {
    id: 'id2',
    left: 100,
    top: 200,
    type: 'logical',
  },
};

const edges: IObject<Edge> = {
  id1: {
    id: 'id1',
    source: 'output',
    sourceNode: 'id1',
    target: 'input',
    targetNode: 'id2',
  },
};
function noop() {
  return;
}
function Overview() {
  const [nodeState, setNodeState] = useState(nodes);
  const [edgeState, setEdgeState] = useState(edges);
  const onDrag = useCallback((e: any, n: Node, c: DraggerData) => {
    const { id } = n;
    setNodeState((pre) => {
      const val = { ...pre[id] };
      [val.left, val.top] = [c.x, c.y];
      return {
        ...pre,
        [id]: val,
      };
    });
  }, []);

  const onEdgeCreate = useCallback((edgeState: EdgeBasic) => {
    const id = `edgeid${Math.round(Math.random() * 100)}`;
    setEdgeState((pre) => ({
      ...pre,
      [id]: { id, ...edgeState },
    }));
  }, []);
  return (
    <Tail
      nodes={nodeState}
      edges={edgeState}
      onEdgeClick={noop}
      onNodeClick={noop}
      onNodeUpdate={noop}
      onEdgeCreate={onEdgeCreate}
      onEdgeUpdate={noop}
      onDelete={noop}
      nodeTemplates={{}}
      edgeTemplates={{}}
      markerTemplates={{}}
      dropThreshold={40}
      quickNodeUpdate={true}
    />
  );
}

export default Overview;
