import React, { FC } from 'react';
import { edgeInProgressAtom } from '@lib/atoms/edges';
import { EdgeInProgressProps } from '@lib/types';
import { useRecoilValue } from 'recoil';
import BasicEdge from './BasicEdge';

const EdgeInProgress: FC<EdgeInProgressProps> = ({
  template: EdgeComponent = BasicEdge as any,
}) => {
  const state = useRecoilValue(edgeInProgressAtom);
  const { active, sourceX, sourceY, targetX, targetY } = state;
  // console.log(state);
  if (!active) return null;
  return <EdgeComponent sourceX={sourceX} sourceY={sourceY} targetX={targetX} targetY={targetY} />;
};

export default EdgeInProgress;
