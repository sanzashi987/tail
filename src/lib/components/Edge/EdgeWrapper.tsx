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
  const [edgeState, setEdgeInternal] = useAtom(atom);
  const { edge, selected, reconnect, hovered } = edgeState;
  const { markerEnd, markerStart, source, sourceNode, target, targetNode, type = '' } = edge;
  const { [sourceNode]: sourceAtom, [targetNode]: targetAtom } = nodeUpdater.getAtoms();
  const sourceNodeState = useAtomValue(sourceAtom ?? DummyNodeAtom);
  const targetNodeState = useAtomValue(targetAtom ?? DummyNodeAtom);
  const [style, setStyle] = useState<CSSProperties>({});

  const sourceTarget = useMemo(() => {
    return calcSourceTargetPoint(sourceNodeState, targetNodeState, source, target);
  }, [sourceNodeState, targetNodeState, source, target]);

  const onClick = (e: React.MouseEvent) => {
    rootInterface.edge.onEdgeClick?.(e, edgeState);
  };
  const onHoverIn = () => {
    !hovered && setEdgeInternal(setHovered);
  };
  const onHoverOut = () => {
    hovered && setEdgeInternal(setNotHovered);
  };

  const onContextMenu = (e: React.MouseEvent) => {
    selected && rootInterface.edge.onEdgeContextMenu?.(e, edgeState);
  };

  const notValidEdge = useMemo(() => {
    return Object.values(sourceTarget).some(isNotNum);
  }, [sourceTarget]);

  const [EdgeComponent, ShadowComponent] = useMemo(() => {
    const { default: d, shadow } = templates[type] ?? defaultEdgePair;
    return [d, shadow];
  }, [templates, type]);

  if (notValidEdge || reconnect) return null;
  return (
    <g style={style}>
      <g className="tail-edge__wrapper">
        <EdgeComponent
          edge={edge}
          hovered={hovered}
          selected={selected}
          {...sourceTarget}
          markerEnd={markerEnd}
          markerStart={markerStart}
          setContainerStyle={setStyle}
        />
      </g>
      <g
        className="tail-edge__event-enhancer"
        onClick={onClick}
        onMouseEnter={onHoverIn}
        onMouseLeave={onHoverOut}
        onContextMenu={onContextMenu}
      >
        <ShadowComponent {...sourceTarget} />
      </g>
    </g>
  );
};

export default EdgeWrapper;
