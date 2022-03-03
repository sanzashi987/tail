import React, { FC } from 'react';
import type { AnchorProps } from '@app/types';
import { wrapAnchor } from '.';

const BasicAnchor: FC<AnchorProps> = ({ color = 'black', strokeWidth = 2 }) => {
  return (
    <polyline
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      points="-20,-7 -10,0 -20,7"
      orient=""
    ></polyline>
  );
};

const BasicClosedAnchor: FC<AnchorProps> = ({ color = 'black', strokeWidth = 1 }) => {
  return (
    <polyline
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      fill={color}
      points="-20,-7 -10,0 -20,7 -20,-7"
    />
  );
};

const BasicMarker = wrapAnchor(BasicAnchor);
const BasicClosedMarker = wrapAnchor(BasicClosedAnchor);
export { BasicAnchor, BasicClosedAnchor, BasicMarker, BasicClosedMarker };
