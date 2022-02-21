import React, { FC, useMemo, useCallback, useContext } from 'react';
import type { EdgeWrapperProps } from '@app/types';
import { useRecoilValue } from 'recoil';
import { computedEdgeSelector } from '@app/atoms/edges';
import { InstanceInterface } from '@app/contexts/instance';

const getMarkerId = (markerId?: string) => {
  if (typeof markerId === 'string') return `url(#${markerId})`;
  return undefined;
};

const EdgeWrapper: FC<EdgeWrapperProps> = ({ atom, nodeAtoms, template: EdgeComponent }) => {
  const { edge, selected, sourceX, sourceY, targetX, targetY, reconnect } = useRecoilValue(
    computedEdgeSelector({ edge: atom, nodeAtoms }),
  );
  if (
    [sourceX, sourceY, targetX, targetY].reduce(
      (last, val) => (typeof val === 'number' && !isNaN(val) ? last || false : true),
      false,
    ) ||
    reconnect
  )
    return null;

  const rootInterface = useContext(InstanceInterface)!;
  const onClick = useCallback(
    (e: React.MouseEvent) => {
      if (!selected) {
        rootInterface.activateItem(e, 'edge', edge.id);
      }
      rootInterface.edge.onEdgeClick(e, edge);
    },
    [selected, edge],
  );

  const { markerEnd, markerStart } = edge;
  const markerStartUrl = useMemo(() => getMarkerId(markerStart), [markerStart]);
  const markerEndUrl = useMemo(() => getMarkerId(markerEnd), [markerEnd]);

  return (
    <g className="tail-edge__wrapper" onClick={onClick}>
      <EdgeComponent
        edge={edge}
        selected={selected}
        sourceX={sourceX}
        sourceY={sourceY}
        targetX={targetX}
        targetY={targetY}
        markerEnd={markerEndUrl}
        markerStart={markerStartUrl}
      />
    </g>
  );
};

export default EdgeWrapper;
