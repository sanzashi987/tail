import type { coordinates, EdgeTree, Node, NodeAtom, NodeAtomState } from '..';

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
  node: Node,
  nodeAtom: NodeAtomState,
  edgeTree: EdgeTree,
  influence: number,
  relaxPower: number,
  distance: number,
  clampedPull: boolean,
) => {
  const globalLoc = getGlobalLocation(node);

  let offset = { x: 0, y: 0 };

  let tarY = 0,
    tarXIn = clampedPull ? globalLoc.x : 0,
    linkCnt = 0,
    hasInput = false;

  for (const handle in nodeAtom.handles.target) {
    const edges  = [...edgeTree.get(node.id)!.get(handle)!.keys()]

    for (const upstreamNode of ) { 

    }

  }
};
