import React, { FC, useMemo, useContext, useEffect, useRef } from 'react';
import type { EdgeWrapperProps } from '@app/types';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { computedEdgeSelector } from '@app/atoms/edges';
import { InstanceInterface } from '@app/contexts/instance';
import { isNum } from '@app/utils';
import { setHovered, setNotHovered } from '@app/atoms/reducers';
import { BasicEdge, BasicShadow } from '.';

const getMarkerId = (markerId?: string) => {
  if (typeof markerId === 'string') return `url(#${markerId})`;
  return undefined;
};

const EdgeWrapper: FC<EdgeWrapperProps> = ({ atom, nodeAtoms, templates, updateEdge }) => {
  const { edge, selected, sourceX, sourceY, targetX, targetY, reconnect, hovered } = useRecoilValue(
    computedEdgeSelector({ edge: atom, nodeAtoms }),
  );
  const setEdge = useSetRecoilState(atom);
  const rootInterface = useContext(InstanceInterface)!;

  const onClick = (e: React.MouseEvent) => {
    rootInterface.activateItem(e, 'edge', edge.id, selected);
    rootInterface.edge.onEdgeClick?.(e, edge);
  };
  const onHoverIn = () => {
    !hovered && setEdge(setHovered);
  };
  const onHoverOut = () => {
    hovered && setEdge(setNotHovered);
  };

  const onContextMenu = (e: React.MouseEvent) => {
    rootInterface.edge.onEdgeContextMenu?.(e, edge);
  };

  const { markerEnd, markerStart, source, sourceNode, target, targetNode } = edge;
  const lastEdge = useRef(edge);
  useEffect(() => {
    if (lastEdge.current !== edge) {
      updateEdge(lastEdge.current, edge);
      lastEdge.current = edge;
    }
  }, [source, sourceNode, target, targetNode]);

  useEffect(() => {
    return () => rootInterface.activateItem(null, 'edge', edge.id, false, true);
  }, []);

  const markerStartUrl = useMemo(() => getMarkerId(markerStart), [markerStart]);
  const markerEndUrl = useMemo(() => getMarkerId(markerEnd), [markerEnd]);

  const { type = '' } = edge;
  const EdgeComponent = templates[type]?.default ?? BasicEdge; //;BezierEdge
  const ShadowComponent = templates[type]?.shadow ?? BasicShadow;

  const memoVNode = useMemo(() => {
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
        <g
          className="tail-edge__event-enhancer"
          onClick={onClick}
          onMouseEnter={onHoverIn}
          onMouseLeave={onHoverOut}
          onContextMenu={onContextMenu}
        >
          <ShadowComponent
            sourceX={sourceX}
            sourceY={sourceY}
            targetX={targetX}
            targetY={targetY}
          />
        </g>
      </>
    );
  }, [edge, hovered, selected, sourceX, sourceY, targetX, targetY, markerEndUrl, markerStartUrl]);

  return memoVNode;
};

export default EdgeWrapper;
