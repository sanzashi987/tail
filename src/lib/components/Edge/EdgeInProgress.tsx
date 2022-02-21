import React, { FC } from 'react';
import { edgeInProgressAtom } from '@app/atoms/edges';
import { EdgeInProgressProps } from '@app/types';
import { useRecoilValue } from 'recoil';

const EdgeInProgress: FC<EdgeInProgressProps> = ({ template: EdgeComponent }) => {
  const { active, sourceX, sourceY, targetX, targetY } = useRecoilValue(edgeInProgressAtom);
  if (!active) return null;
  return <EdgeComponent sourceX={sourceX} sourceY={sourceY} targetX={targetX} targetY={targetY} />;
};

export default EdgeInProgress;
