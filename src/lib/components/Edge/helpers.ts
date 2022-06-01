import BasicEdge from './BasicEdge';
import BasicShadow from './BasicShadow';

export const getMarkerId = (markerId?: string) => {
  if (typeof markerId === 'string') return `url(#${markerId})`;
  return undefined;
};

export const defaultEdgePair = {
  default: BasicEdge,
  shadow: BasicShadow,
};

export const emptyHandle = {
  x: NaN,
  y: NaN,
};
