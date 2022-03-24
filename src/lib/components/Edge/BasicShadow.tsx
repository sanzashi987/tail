import React, { FC } from 'react';
import { EdgeBasicProps } from '@app/types';

const BasicShadow: FC<EdgeBasicProps> = ({ sourceX, sourceY, targetX, targetY }) => {
  return (
    <path
      className="tail-edge__basic-shadow"
      d={`M ${sourceX},${sourceY}L ${targetX},${targetY}`}
      strokeWidth={15}
    />
  );
};

export default BasicShadow;
