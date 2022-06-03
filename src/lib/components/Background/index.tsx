import React, { useContext, FC } from 'react';
import { ViewerContext } from '@lib/contexts/viewer';
import type { BackgroundProps } from '@lib/types';
import { getCSSVar } from '@lib/containers/InfiniteViewer/utils';
import styles from './index.module.scss';

const { 'tail-editor-background': bgClass } = styles;

const Background: FC<BackgroundProps> = ({ style }) => {
  const { scale, offset } = useContext(ViewerContext);
  const { '--bgsize': size, '--bgpos': pos } = getCSSVar(offset, scale);

  return (
    <div
      className={bgClass}
      style={{
        backgroundSize: size,
        backgroundPosition: pos,
        ...style,
      }}
    ></div>
  );
};

export default Background;
