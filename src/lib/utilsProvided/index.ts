import type { EdgeTree, EdgeBasicProps } from '@lib/types';

export { wrapAnchor } from '@lib/components/Anchor';

export const flatNodeEdgeMap = (edgeTree: EdgeTree) => {
  return [...edgeTree.keys()].reduce<string[]>((last, curr) => {
    return last.concat(getConnectedEdgeByNode(curr, edgeTree));
  }, []);
};

export const getConnectedEdgeByNode = (nodeId: string, edgeTree: EdgeTree) => {
  const handles = edgeTree.get(nodeId)?.values();
  if (!handles) return [];

  const res = [...handles].reduce<string[]>((last, handle) => {
    return last.concat([...handle.values()].map((e) => e.id));
  }, []);
  return res;
};

const PERCENT = 0.25;
const DIST = 30;

type CoordinateArray = [number, number];

export function drawBezier({ sourceX, sourceY, targetX, targetY }: EdgeBasicProps) {
  const dist = Math.sqrt(Math.abs(sourceX - targetX) ** 2 + Math.abs(sourceY - targetY) ** 2);
  const [sourceXDamping, sourceYDamping]: CoordinateArray = [(dist * PERCENT + DIST) * 1, 0];
  const [targetXDamping, targetYDamping]: CoordinateArray = [(dist * PERCENT + DIST) * -1, 0];
  // const [sourceXDamping, sourceYDamping]: CoordinateArray = [100  * 1, 0];
  // const [targetXDamping, targetYDamping]: CoordinateArray = [100  * -1, 0];

  const [sourceXCtrl, sourceYCtrl] = [sourceX + sourceXDamping, sourceY + sourceYDamping];
  const [targetXCtrl, targetYCtrl] = [targetX + targetXDamping, targetY + targetYDamping];
  return `M ${sourceX} ${sourceY} C ${sourceXCtrl} ${sourceYCtrl} ${targetXCtrl} ${targetYCtrl} ${targetX} ${targetY}`;
}
