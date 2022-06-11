import React, { FC } from 'react';
import { EdgeBasicProps } from '@lib/types';
import { drawBezier } from '@lib/utilsProvided';

const BezierShadow: FC<EdgeBasicProps> = (props) => {
  const d = drawBezier(props);
  return <path className="tail-edge__bezier-shadow" d={d} strokeWidth={15} />;
};

export default BezierShadow;
