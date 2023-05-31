import React, { FC } from 'react';
import { edgeInProgressAtom } from '@lib/atoms/edges';
import { EdgeInProgressProps } from '@lib/types';
import { useAtomValue } from 'jotai';
import BasicEdge from './BasicEdge';

const EdgeInProgress: FC<EdgeInProgressProps> = ({
  template: EdgeComponent = BasicEdge as any,
}) => {
  const state = useAtomValue(edgeInProgressAtom);
  const { active, sourceX, sourceY, targetX, targetY, pairedStatus } = state;
  // console.log(state);
  if (!active) return null;
  return (
    <EdgeComponent
      sourceX={sourceX}
      sourceY={sourceY}
      targetX={targetX}
      targetY={targetY}
      pairedStatus={pairedStatus}
    />
  );
};

export default EdgeInProgress;
