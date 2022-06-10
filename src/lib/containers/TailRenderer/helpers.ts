import type { coordinates, NodeAtom } from '@lib/types';

function isInside(
  comStart: coordinates,
  comEnd: coordinates,
  svgStart: coordinates,
  svgEnd: coordinates,
): boolean {
  if (
    comStart.x > svgEnd.x ||
    svgStart.x > comEnd.x ||
    comStart.y > svgEnd.y ||
    svgStart.y > comEnd.y ||
    svgStart.x === svgEnd.x ||
    svgStart.y === svgEnd.y
  ) {
    return false;
  }
  return true;
}

function sort(a: number, b: number) {
  return a - b;
}

export function getInsideIds(
  nodes: string[],
  getNodes: (id: string) => NodeAtom | null,
  topleft: coordinates,
  bottomRight: coordinates,
  offset: coordinates,
  scale: number,
) {
  const startX = (topleft.x - offset.x) / scale;
  const startY = (topleft.y - offset.y) / scale;
  const endX = (bottomRight.x - offset.x) / scale;
  const endY = (bottomRight.y - offset.y) / scale;
  const [xMin, xMax, yMin, yMax] = [...[startX, endX].sort(sort), ...[startY, endY].sort(sort)];

  return nodes.reduce<string[]>((last, key) => {
    const nodeState = getNodes(key);
    if (nodeState) {
      const {
        rect: { width, height },
        node: { left, top },
      } = nodeState;
      const [xCurMin, xCurMax, yCurMin, yCurMax] = [left, left + width, top, top + height];
      if (
        isInside(
          { x: xCurMin, y: yCurMin },
          { x: xCurMax, y: yCurMax },
          { x: xMin, y: yMin },
          { x: xMax, y: yMax },
        )
      ) {
        last.push(key);
      }
    }
    return last;
  }, []);
}
