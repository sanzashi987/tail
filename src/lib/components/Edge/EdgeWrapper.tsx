import React, { FC, useMemo, useCallback, useContext } from 'react';
import type { EdgeWrapperProps } from '@app/types';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { computedEdgeSelector } from '@app/atoms/edges';
import { InstanceInterface } from '@app/contexts/instance';
import { isNum } from '@app/utils';

const getMarkerId = (markerId?: string) => {
  if (typeof markerId === 'string') return `url(#${markerId})`;
  return undefined;
};

const EdgeWrapper: FC<EdgeWrapperProps> = ({
  atom,
  nodeAtoms,
  template: EdgeComponent,
  shadow: ShadowEdge,
}) => {
  const { edge, selected, sourceX, sourceY, targetX, targetY, reconnect, hovered } = useRecoilValue(
    computedEdgeSelector({ edge: atom, nodeAtoms }),
  );
  const setEdge = useSetRecoilState(atom);
  const rootInterface = useContext(InstanceInterface)!;
  const onClick = useCallback(
    (e: React.MouseEvent) => {
      rootInterface.activateItem(e, 'edge', edge.id, selected);
      rootInterface.edge.onEdgeClick(e, edge);
    },
    [selected, edge],
  );

  const onHoverIn = useCallback((e: React.MouseEvent) => {
    setEdge((prev) => ({ ...prev, hovered: true }));
  }, []);
  const onHoverOut = useCallback((e: React.MouseEvent) => {
    setEdge((prev) => ({ ...prev, hovered: false }));
  }, []);

  const { markerEnd, markerStart } = edge;
  const markerStartUrl = useMemo(() => getMarkerId(markerStart), [markerStart]);
  const markerEndUrl = useMemo(() => getMarkerId(markerEnd), [markerEnd]);

  if (
    [sourceX, sourceY, targetX, targetY].reduce(
      (last, val) => (isNum(val) ? last || false : true),
      false,
    ) ||
    reconnect
  ) {
    return null;
  }

  return (
    <>
      <g
        className="tail-edge__event-enhancer"
        onClick={onClick}
        onMouseOver={onHoverIn}
        onMouseLeave={onHoverOut}
      >
        <ShadowEdge sourceX={sourceX} sourceY={sourceY} targetX={targetX} targetY={targetY} />
      </g>
      <g className="tail-edge__wrapper">
        <EdgeComponent
          edge={edge}
          hovered={hovered}
          selected={selected}
          sourceX={sourceX}
          sourceY={sourceY}
          targetX={targetX}
          targetY={targetY}
          markerEnd={markerEndUrl}
          markerStart={markerStartUrl}
        />
      </g>
    </>
  );
};

export default EdgeWrapper;
