import React, { useCallback, useState } from 'react';
import { Tail } from '@app/index';
import { coordinates, Edge, Node } from '@app/types';

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
  const onDrag = useCallback((e: any, n: Node, c: coordinates) => {
    const { id } = n;
    setNodeState((pre) => {
      const val = { ...pre[id] };
      [val.top, val.left] = [c.x, c.y];
      return {
        ...pre,
        [id]: val,
      };
    });
  }, []);
  // const onNodeDelete = useCallback(() => {

  // })
  return (
    <Tail
      nodes={nodeState}
      edges={edgeState}
      onEdgeClick={noop}
      onNodeClick={noop}
      onNodeCreate={noop}
      onNodeDelete={noop}
      onEdgeCreate={noop}
      onEdgeUpdate={noop}
      onEdgeDelete={noop}
      onDragStart={onDrag}
      onDrag={onDrag}
      onDragEnd={onDrag}
      nodeTemplates={{}}
      edgeTemplates={{}}
      markerTemplates={{}}
    />
  );
}

export default Overview;
