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

const arrangeRelax = (
  nodeId: string,
  nodes: Record<string, Node>,
  nodeGetter: (atom: JotaiImmerAtom<NodeAtomState>) => NodeAtomState,
  nodeAtoms: Record<string, JotaiImmerAtom<NodeAtomState>>,
  edgeTree: EdgeTree,
  influence: number,
  relaxPower: number,
  distance: number,
  clampedPull: boolean,
) => {
  const currentNode = nodes[nodeId];
  const currentNodeAtom = nodeGetter(nodeAtoms[nodeId]);
  const currentNodeCoor = getGlobalLocation(currentNode);
  const currentNodeRect = currentNodeAtom.rect;

  const offset = { x: 0, y: 0 };

  let tarY = 0,
    tarXIn = clampedPull ? currentNodeCoor.x : 0,
    linkCnt = 0,
    hasInput = false;

  for (const handle in currentNodeAtom.handles.target) {
    const edges = [...edgeTree.get(nodeId)!.get(handle)!.values()];

    for (const edge of edges) {
      const upstreamNodeAtom = nodeGetter(nodeAtoms[edge.sourceNode]);
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
        socket_pos(socket, node.inputs, currentNodeRect.height) -
        socket_pos(link.from_socket, other.outputs, upsteamNodeRect.height);
      linkCnt++;
    }
  }

  let tarXOut = clampedPull ? currentNodeCoor.x : 0,
    hasOutput = false;

  for (const handle in currentNodeAtom.handles.source) {
    const edges = [...edgeTree.get(nodeId)!.get(handle)!.values()];

    for (const edge of edges) {
      const downstreamNodeAtom = nodeGetter(nodeAtoms[edge.targetNode]);
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
        socket_pos(socket, node.inputs, currentNodeRect.y) -
        socket_pos(link.from_socket, other.outputs, downstreamNodeRect.height);
      linkCnt++;
    }
  }
};
