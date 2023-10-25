import type { coordinates, EdgeTree, JotaiImmerAtom, Node, NodeAtom, NodeAtomState } from '..';

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

const socketPosition = (
  node: string,
  tree: EdgeTree,
  handle: string,
  handles: string[],
  size: number,
) => {
  const nodeHandles = tree.get(node)!;
  const handleConnected = handles.filter((e) => !!nodeHandles.get(e));

  //possible issue here, the object key array is not ordered
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
  const currentNodeAtom = nodeAtomStates[nodeId];
  const currentNode = currentNodeAtom.node;
  const currentNodeCoor = getGlobalLocation(currentNode);
  const currentNodeRect = currentNodeAtom.rect;

  const offset: coordinates = { x: 0, y: 0 };

  let tarY = 0,
    tarXIn = clampedPull ? currentNodeCoor.x : 0,
    linkCnt = 0,
    hasInput = false;

  const inputs = currentNodeAtom.handles.target;

  for (const handle in inputs) {
    const edges = [...edgeTree.get(nodeId)!.get(handle)!.values()];

    for (const edge of edges) {
      const upstreamNodeAtom = nodeAtomStates[edge.sourceNode];
      const upsteamNodeCoor = getGlobalLocation(upstreamNodeAtom.node);
      const upsteamNodeRect = { ...upstreamNodeAtom.rect };
      const x = upsteamNodeCoor.x + upsteamNodeRect.width + distance;

      if (clampedPull) {
        tarXIn = hasInput ? Math.max(tarXIn, x) : x;
      } else {
        tarXIn += x;
      }
      hasInput = true;
      tarY +=
        upsteamNodeCoor.y +
        socketPosition(handle, inputs, currentNodeRect.height) -
        socketPosition(link.from_socket, other.outputs, upsteamNodeRect.height);
      linkCnt++;
    }
  }

  const tarXOut = clampedPull ? currentNodeCoor.x : 0;
  let hasOutput = false;

  for (const handle in currentNodeAtom.handles.source) {
    const edges = [...edgeTree.get(nodeId)!.get(handle)!.values()];

    for (const edge of edges) {
      const downstreamNodeAtom = nodeAtomStates[edge.targetNode];
      const downstreamNodeCoor = getGlobalLocation(downstreamNodeAtom.node);
      const downstreamNodeRect = { ...downstreamNodeAtom.rect };
      const x = downstreamNodeCoor.x - currentNodeRect.width - distance;

      if (clampedPull) {
        tarXIn = hasOutput ? Math.min(tarXOut, x) : x;
      } else {
        tarXIn += x;
      }
      hasOutput = true;
      tarY +=
        downstreamNodeCoor.y +
        socketPosition(socket, node.inputs, currentNodeRect.y) -
        socketPosition(link.from_socket, other.outputs, downstreamNodeRect.height);
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
    offset.x += (tarX - currentNodeCoor.x) * relaxPower;
    offset.y += (tarY - currentNodeCoor.y) * relaxPower;

    if (Math.abs(offset.x) > 1 || Math.abs(offset.y) > 1) {
      applyMovement(nodeId, nodeAtomStates, {
        x: offset.x * influence,
        y: offset.y * influence,
      });
      return true;
    } else return false;
  }
};

const applyMovement = (
  nodeId: string,
  nodeAtomStates: Record<string, NodeAtomState>,
  offset: coordinates,
) => {};
