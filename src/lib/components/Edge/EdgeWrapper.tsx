import React, { FC, useMemo, useContext, useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { InstanceInterface } from '@app/contexts/instance';
import { isNotNum } from '@app/utils';
import { setHovered, setNotHovered } from '@app/atoms/reducers';
import { DummyNodeAtom } from '@app/atoms/nodes';
import type { EdgeWrapperProps } from '@app/types';
import { defaultEdgePair, emptyHandle } from './helpers';

const EdgeWrapper: FC<EdgeWrapperProps> = ({ atom, nodeAtoms, templates, updateEdge }) => {
  const rootInterface = useContext(InstanceInterface)!;
  const [{ edge, selected, reconnect, hovered }, setEdge] = useAtom(atom);
  const { markerEnd, markerStart, source, sourceNode, target, targetNode, type = '' } = edge;
  const { [sourceNode]: sourceAtom, [targetNode]: targetAtom } = nodeAtoms;
  const [sourceNodeState] = useAtom(sourceAtom ?? DummyNodeAtom);
  const [targetNodeState] = useAtom(targetAtom ?? DummyNodeAtom);

  const { sourceX, sourceY, targetX, targetY } = useMemo(() => {
    const {
      handles: { source: sourceHandles },
      node: { left: sourceLeft, top: sourceTop },
    } = sourceNodeState;
    const {
      handles: { target: targetHandles },
      node: { left: targetLeft, top: targetTop },
    } = targetNodeState;
    const { x: sourceX, y: sourceY } = sourceHandles[source] ?? emptyHandle;
    const { x: targetX, y: targetY } = targetHandles[target] ?? emptyHandle;

    return {
      sourceX: sourceX + sourceLeft,
      sourceY: sourceY + sourceTop,
      targetX: targetX + targetLeft,
      targetY: targetY + targetTop,
    };
  }, [sourceNodeState, targetNodeState, source, target]);

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

  // const markerStartUrl = useMemo(() => getMarkerId(markerStart), [markerStart]);
  // const markerEndUrl = useMemo(() => getMarkerId(markerEnd), [markerEnd]);

  const [EdgeComponent, ShadowComponent] = useMemo(() => {
    const { default: d, shadow } = templates[type] ?? defaultEdgePair;
    return [d, shadow];
  }, [templates, type]);

  const memoVNode = useMemo(() => {
    if ([sourceX, sourceY, targetX, targetY].some(isNotNum) || reconnect) return null;
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
            markerEnd={markerEnd}
            markerStart={markerStart}
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
  }, [edge, hovered, selected, sourceX, sourceY, targetX, targetY, markerEnd, markerStart]);

  return memoVNode;
};

export default EdgeWrapper;
