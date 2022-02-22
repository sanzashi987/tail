import React, { FC } from 'react';
import type { AnchorProps } from '@app/types';
import { wrapAnchor } from '.';

const BasicAnchor: FC<AnchorProps> = ({ color = 'none', strokeWidth = 1 }) => {
  return (
    <polyline
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      points="-5,-4 0,0 -5,4"
    ></polyline>
  );
};

const BasicClosedAnchor: FC<AnchorProps> = ({ color = 'none', strokeWidth = 1 }) => {
  return (
    <polyline
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      fill={color}
      points="-5,-4 0,0 -5,4 -5,-4"
    />
  );
};

const BasicMarker = wrapAnchor(BasicAnchor);
const BasicClosedMarker = wrapAnchor(BasicClosedAnchor);
export { BasicAnchor, BasicClosedAnchor, BasicMarker, BasicClosedMarker };
