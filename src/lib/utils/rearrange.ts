import type { coordinates, EdgeTree, HandleMap, Node, NodeAtomState, Rect } from '..';

type Options = {
  brushSize: number;
  distance: number;
  relaxPower: number;
  slidePower: number;
  collisionPower: number;
  adpativeIter: boolean;
  onlySelected: boolean;
  iterates: {
    1: number;
    2: number;
    3: number;
    4: number;
  };
};

const MOVE_UNIT = 1;

const step = (
  stepNumber: number,
  iterNum: number,
  nodes: Node[],
  selected: Record<string, boolean>,
  opt: Options,
  center: coordinates,
  cb: (node: Node, t: number) => boolean,
) => {
  for (let i = 0; i < iterNum; i++) {
    const newCenter = { x: 0, y: 0 };
    let [nodeCount, changed] = [0, false];
    for (const node of nodes) {
      // if (false) continue; potential bailout
      if (opt.onlySelected && !selected[node.id]) continue;
      if (cb(node, i / iterNum)) {
        changed = true;
      }
      const { x, y } = getGlobalLocation(node);

      newCenter.x += x;
      newCenter.y += y;
      nodeCount += 1;
    }

    if (!changed && opt.adpativeIter) {
      break;
    }
    if (!opt.onlySelected) {
      newCenter.x /= nodeCount;
      newCenter.y /= nodeCount;
      const slide = { x: center.x - newCenter.x, y: center.y - newCenter.y };
      for (const node of nodes) {
        node.left += slide.x;
        node.top += slide.y;
      }
    }
  }
};

const getGlobalLocation = (node: Node) => {
  return { x: node.left, y: node.top };
};

const orderedHandleKeys = (handleMap: HandleMap) => {
  return Object.entries(handleMap)
    .sort((a, b) => {
      return a[1].y - b[1].y;
    })
    .map((e) => e[0]);
};

const socketPosition = (
  tree: EdgeTree,
  node: string,
  handle: string,
  handles: string[],
  size: number,
) => {
  const nodeHandles = tree.get(node)!;
  const handleConnected = handles.filter((e) => !!nodeHandles.get(e));

  for (let i = 0; i < handleConnected.length; i++) {
    if (handle === handleConnected[i]) {
      return (i / handleConnected.length) * size;
    }
  }

  return size / 2;
};

const arrangeRelax = (
  nodeId: string,
  nodeAtomStates: Record<string, NodeAtomState>,
  edgeTree: EdgeTree,
  influence: number,
  relaxPower: number,
  distance: number,
  clampedPull: boolean,
) => {
  const nodeState = nodeAtomStates[nodeId];
  const nodeCoor = getGlobalLocation(nodeState.node);
  const nodeRect = nodeState.rect;

  const offset: coordinates = { x: 0, y: 0 };

  let tarY = 0,
    tarXIn = clampedPull ? nodeCoor.x : 0,
    linkCnt = 0,
    hasInput = false;

  const inputs = nodeState.handles.target;

  for (const handle in inputs) {
    const edges = [...edgeTree.get(nodeId)!.get(handle)!.values()];

    for (const edge of edges) {
      const upstreamNode = nodeAtomStates[edge.sourceNode];
      const upsteamNodeCoor = getGlobalLocation(upstreamNode.node);
      const upsteamNodeRect = { ...upstreamNode.rect };
      const x = upsteamNodeCoor.x + upsteamNodeRect.width + distance;

      if (clampedPull) {
        tarXIn = hasInput ? Math.max(tarXIn, x) : x;
      } else {
        tarXIn += x;
      }
      hasInput = true;
      tarY +=
        upsteamNodeCoor.y +
        socketPosition(
          edgeTree,
          nodeState.node.id,
          handle,
          orderedHandleKeys(inputs),
          nodeRect.height,
        ) -
        socketPosition(
          edgeTree,
          upstreamNode.node.id,
          edge.source,
          orderedHandleKeys(upstreamNode.handles.source),
          upsteamNodeRect.height,
        );
      linkCnt++;
    }
  }

  const tarXOut = clampedPull ? nodeCoor.x : 0;
  let hasOutput = false;

  const outputs = nodeState.handles.source;

  for (const handle in outputs) {
    const edges = [...edgeTree.get(nodeId)!.get(handle)!.values()];

    for (const edge of edges) {
      const downstreamNode = nodeAtomStates[edge.targetNode];
      const downstreamNodeCoor = getGlobalLocation(downstreamNode.node);
      const downstreamNodeRect = { ...downstreamNode.rect };
      const x = downstreamNodeCoor.x - nodeRect.width - distance;

      if (clampedPull) {
        tarXIn = hasOutput ? Math.min(tarXOut, x) : x;
      } else {
        tarXIn += x;
      }
      hasOutput = true;
      tarY +=
        downstreamNodeCoor.y +
        socketPosition(
          edgeTree,
          nodeState.node.id,
          handle,
          orderedHandleKeys(outputs),
          nodeRect.y,
        ) -
        socketPosition(
          edgeTree,
          downstreamNode.node.id,
          edge.target,
          orderedHandleKeys(downstreamNode.handles.target),
          downstreamNodeRect.height,
        );
      linkCnt++;
    }
  }

  if (linkCnt > 0) {
    let tarX;
    if (clampedPull) {
      tarX = tarXIn * Number(hasInput) + tarXOut * Number(hasOutput);
      tarX /= Number(hasInput) + Number(hasOutput);
    } else {
      tarX = (tarXIn + tarXOut) / linkCnt;
    }
    tarY /= linkCnt;
    offset.x += (tarX - nodeCoor.x) * relaxPower;
    offset.y += (tarY - nodeCoor.y) * relaxPower;

    if (Math.abs(offset.x) > MOVE_UNIT || Math.abs(offset.y) > MOVE_UNIT) {
      applyMovement(nodeId, nodeAtomStates, {
        x: offset.x * influence,
        y: offset.y * influence,
      });
      return true;
    } else return false;
  }
};

const shallowCopyAndApplyDelta = <T extends Rect>(rect: T, delta: coordinates) => {
  const next = { ...rect };
  next.x += delta.x;
  next.y += delta.y;
  return next;
};

const applyMovement = (
  nodeId: string,
  nodeAtomStates: Record<string, NodeAtomState>,
  delta: coordinates,
) => {
  const nodeState = nodeAtomStates[nodeId];
  nodeState.rect = shallowCopyAndApplyDelta(nodeState.rect, delta);
  nodeState.node.left += delta.x;
  nodeState.node.top += delta.y;

  for (const type in nodeState.handles) {
    const typeKey = type as keyof NodeAtomState['handles'];
    for (const handleKey in nodeState.handles[typeKey]) {
      nodeState.handles[typeKey][handleKey] = shallowCopyAndApplyDelta(
        nodeState.handles[typeKey][handleKey],
        delta,
      );
    }
  }
};

const calcNode = (
  edgeTree: EdgeTree,
  nodeId: string,
  nodeAtomStates: Record<string, NodeAtomState>,
  influence: number,
  slideVector: coordinates,
  relaxPower: number,
  collidePower: number,
  collideDist: coordinates,
  pullNonSiblings: boolean,
) => {
  const nodeState = nodeAtomStates[nodeId];
  if (nodeState.node.type === '') {
    return false;
  }

  const nodeCoor = getGlobalLocation(nodeState.node);
  const nodeRect = nodeState.rect;
  const offset = { ...slideVector };

  if (relaxPower > 0) {
    let tarY = 0,
      linkCnt = 0,
      tarXIn = nodeCoor.x,
      hasInput = false;

    const inputs = nodeState.handles.target;
    for (const handle in inputs) {
      const edges = [...edgeTree.get(nodeId)!.get(handle)!.values()];
      for (const edge of edges) {
        const upstreamNodeAtom = nodeAtomStates[edge.targetNode];

        // parent
        // if (!pullNonSiblings && nodeState.parent !== upstreamNodeAtom.parent) {
        //   continue;
        // }

        const upstreamNodeCoor = getGlobalLocation(upstreamNodeAtom.node);
        const upstreamNodeRect = { ...upstreamNodeAtom.rect };
        const x = upstreamNodeCoor.x + upstreamNodeRect.width + collideDist.x;

        tarXIn = Number(hasInput) > 0 ? Math.max(tarXIn, x) : x;
        hasInput = true;
        tarY += upstreamNodeCoor.y - upstreamNodeRect.height / 2;
        linkCnt++;
      }
    }

    let tarXOut = nodeCoor.x,
      hasOutput = false;

    const outputs = nodeState.handles.source;
    for (const handle in outputs) {
      const edges = [...edgeTree.get(nodeId)!.get(handle)!.values()];
      for (const edge of edges) {
        const downstreamNode = nodeAtomStates[edge.targetNode];
        // if (!pullNonSiblings && nodeState.parent !== downstreamNodeAtom.parent) {
        //   continue;
        // }
        const downstreamNodeCoor = getGlobalLocation(downstreamNode.node);
        const downstreamNodeRect = { ...downstreamNode.rect };

        const x = downstreamNodeCoor.x - nodeRect.width - collideDist.x;

        tarXOut = Number(hasOutput) ? Math.min(tarXOut, x) : x;
        hasOutput = true;

        tarY += downstreamNodeCoor.y - downstreamNodeRect.height / 2;
        linkCnt += 1;
      }
    }

    if (linkCnt > 0) {
      let tarX = tarXIn * Number(hasInput) + tarXOut * Number(hasOutput);
      tarX /= Number(hasInput) + Number(hasOutput);
      tarY /= linkCnt;
      tarY += nodeRect.height / 2;
      offset.x += (tarX - nodeCoor.x) * relaxPower;
      offset.y += (tarY - nodeCoor.y) * relaxPower;
    }
  }

  if (collidePower > 0) {
    for (const node in nodeAtomStates) {
      if (node === nodeId) continue;
      const nodeState = nodeAtomStates[node];
      // if (nodeState.node.type === '') continue;
    }
  }

  if (Math.abs(offset.x) > MOVE_UNIT || Math.abs(offset.y) > MOVE_UNIT) {
    applyMovement(nodeId, nodeAtomStates, {
      x: offset.x * influence,
      y: offset.y * influence,
    });
    return true;
  } else {
    return false;
  }
};

const collide = (
  coor0: coordinates,
  coor1: coordinates,
  rect0: Rect,
  rect1: Rect,
  offset: coordinates,
  power: number,
  dist: coordinates,
  onlyY = false,
) => {
  const pos0 = {
    x: coor0.x + rect0.width / 2,
    y: coor0.y + rect0.height / 2,
  };
  const pos1 = {
    x: coor1.x + rect0.width / 2,
    y: coor1.y + rect0.height / 2,
  };

  pos0.y -= rect0.height;
  pos1.y -= rect1.height;

  const size = {
    width: (rect0.width + rect1.width) / 2 + dist.x,
    height: (rect0.height + rect1.height) / 2 + dist.y,
  };

  const delta = {
    x: pos0.x - pos1.x,
    y: pos0.y - pos1.y,
  };

  const inters = {
    x: size.width - Math.abs(delta.x),
    y: size.height - Math.abs(delta.y),
  };

  if (inters.x > 0 && inters.y > 0) {
    if (inters.y < inters.x || onlyY) {
      if (delta.y > 0) {
        inters.y *= -1;
      }
      offset.y += (inters.y / 2) * power;
    } else {
      if (delta.x > 0) {
        inters.x *= -1;
      }
      offset.x += (inters.x / 2) * power;
    }
  }
};

const calcCollisionY = (
  nodeId: string,
  nodeAtomStates: Record<string, NodeAtomState>,
  collidePower: number,
  collideDist: coordinates,
) => {
  const nodeAtomState = nodeAtomStates[nodeId];
  const coor = getGlobalLocation(nodeAtomState.node);
  const rect = nodeAtomState.rect;

  const offset = { x: 0, y: 0 };

  for (const id in nodeAtomStates) {
    if (id === nodeId) {
      continue;
    }
    const otherNode = nodeAtomStates[id];
    collide(
      coor,
      getGlobalLocation(otherNode.node),
      rect,
      otherNode.rect,
      offset,
      1,
      collideDist,
      true,
    );
  }

  if (Math.abs(offset.y) > MOVE_UNIT) {
    applyMovement(nodeId, nodeAtomStates, {
      x: offset.x * collidePower,
      y: offset.y * collidePower,
    });
    return true;
  } else {
    return false;
  }
};
