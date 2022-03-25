import React, { useCallback, useEffect, useState } from 'react';
import { DraggerData, Edge, EdgeBasic, Node, IObject } from '@app/types';
// import { MiniMap, Tail } from '../../../dist/esm/index';
import { MiniMap, Tail } from '@app/index';
// import '../../../dist/esm/index.css';

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
  id3: {
    id: 'id3',
    left: 1510,
    top: 850,
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
function templatePicker(node: Node) {
  return [node.type, node.fold ? 'folded' : 'default'] as [string, string];
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

  useEffect(() => {
    setTimeout(() => {
      setNodeState((prev) => {
        return {
          ...prev,
          ['id233']: {
            id: 'id233',
            left: 510,
            top: 250,
            type: 'logical',
          },
        };
      });
    }, 5000);
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Tail
        nodes={nodeState}
        edges={edgeState}
        onEdgeClick={noop}
        onNodeClick={noop}
        onNodeUpdate={noop}
        onNodeContextMenu={noop}
        onEdgeCreate={onEdgeCreate}
        onEdgeUpdate={noop}
        onEdgeContextMenu={noop}
        onDelete={noop}
        nodeTemplates={{}}
        edgeTemplates={{}}
        markerTemplates={{}}
        nodeTemplatePicker={templatePicker}
      >
        <MiniMap />
      </Tail>
    </div>
  );
}

export default Overview;
