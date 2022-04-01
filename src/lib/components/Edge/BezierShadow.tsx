import React, { FC } from 'react';
import { EdgeBasicProps } from '@app/types';
import { drawBezier } from './drawBezier';

const BezierShadow: FC<EdgeBasicProps> = (props) => {
  const d = drawBezier(props);
  return <path className="tail-edge__bezier-shadow" d={d} strokeWidth={15} />;
};

export default BezierShadow;
