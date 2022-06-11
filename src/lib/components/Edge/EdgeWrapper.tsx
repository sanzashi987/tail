import React, { FC, useMemo, useContext, useState, CSSProperties } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { InstanceInterface } from '@lib/contexts/instance';
import { isNotNum } from '@lib/utils';
import { setHovered, setNotHovered } from '@lib/atoms/reducers';
import { DummyNodeAtom } from '@lib/atoms/nodes';
import type { EdgeWrapperProps, NodeAtomState } from '@lib/types';
import { ParserContext } from '@lib/contexts';
import { defaultEdgePair, emptyHandle } from './helpers';

function calcSourceTargetPoint(
  sourceNodeState: NodeAtomState,
  targetNodeState: NodeAtomState,
  source: string,
  target: string,
) {
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
}

const EdgeWrapper: FC<EdgeWrapperProps> = ({ atom, templates }) => {
  const rootInterface = useContext(InstanceInterface)!;
  const { nodeUpdater } = useContext(ParserContext)!;
  const [{ edge, selected, reconnect, hovered }, setEdge] = useAtom(atom);
  const { markerEnd, markerStart, source, sourceNode, target, targetNode, type = '' } = edge;
  const { [sourceNode]: sourceAtom, [targetNode]: targetAtom } = nodeUpdater.getAtoms();
  const sourceNodeState = useAtomValue(sourceAtom ?? DummyNodeAtom);
  const targetNodeState = useAtomValue(targetAtom ?? DummyNodeAtom);
  const [style, setStyle] = useState<CSSProperties>({});

  const { sourceX, sourceY, targetX, targetY } = useMemo(() => {
    return calcSourceTargetPoint(sourceNodeState, targetNodeState, source, target);
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
    selected && rootInterface.edge.onEdgeContextMenu?.(e, edge);
  };

  const notValidEdge = useMemo(() => {
    return [sourceX, sourceY, targetX, targetY].some(isNotNum);
  }, [sourceX, sourceY, targetX, targetY]);

  const [EdgeComponent, ShadowComponent] = useMemo(() => {
    const { default: d, shadow } = templates[type] ?? defaultEdgePair;
    return [d, shadow];
  }, [templates, type]);

  if (notValidEdge || reconnect) return null;
  return (
    <>
      <g className="tail-edge__wrapper" style={style}>
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
          setContainerStyle={setStyle}
        />
      </g>
      <g
        className="tail-edge__event-enhancer"
        style={style}
        onClick={onClick}
        onMouseEnter={onHoverIn}
        onMouseLeave={onHoverOut}
        onContextMenu={onContextMenu}
      >
        <ShadowComponent sourceX={sourceX} sourceY={sourceY} targetX={targetX} targetY={targetY} />
      </g>
    </>
  );
};

export default EdgeWrapper;
