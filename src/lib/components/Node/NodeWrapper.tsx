import React, {
  FC,
  CSSProperties,
  useRef,
  useMemo,
  useCallback,
  useEffect,
  useContext,
} from 'react';
import type { NodeWrapperProps, coordinates, NodeCom, DraggerData } from '@app/types';
import { InstanceInterface } from '@app/contexts/instance';
import { useRecoilState } from 'recoil';
import { setHovered, setNotHovered } from '@app/atoms/reducers';
import Dragger from './Dragger';
import { getNodeInfo } from './utils';
import styles from './Wrapper.module.scss';
import { BasicNode } from '.';

const NodeWrapper: FC<NodeWrapperProps> = ({ atom, templatePicker, templates }) => {
  const [{ node, selected, selectedHandles, hovered }, setNodeInternal] = useRecoilState(atom);
  const ref = useRef<HTMLDivElement>(null);
  const rootInterface = useContext(InstanceInterface)!;
  const { left: x, top: y } = node;

  const style = useMemo(() => {
    return {
      transform: `translate(${x}px,${y}px)`,
    } as CSSProperties;
  }, [x, y]);

  //built-in event callbacks
  const dragStart = useCallback(
    (e: React.MouseEvent, c: DraggerData) => {
      // if (!selected) return false;
      return rootInterface.node.onDragStart?.(e, node, c);
    },
    [node, selected],
  );
  const drag = useCallback(
    (e: MouseEvent, c: DraggerData) => {
      return rootInterface.node.onDrag?.(e, node, c);
    },
    [node],
  );
  const dragEnd = useCallback(
    (e: MouseEvent, c: DraggerData) => {
      // setCoordinate(c);
      return rootInterface.node.onDragEnd?.(e, node, c);
    },
    [node],
  );
  const onNodeClick = useCallback(
    (e: React.MouseEvent) => {
      // e.stopPropagation();
      rootInterface.activateItem(e, 'node', node.id, selected);
      rootInterface.node.onNodeClick?.(e, node);
    },
    [selected, node],
  );

  const onHoverIn = useCallback((e: React.MouseEvent) => {
    setNodeInternal(setHovered);
  }, []);
  const onHoverOut = useCallback((e: React.MouseEvent) => {
    setNodeInternal(setNotHovered);
  }, []);

  const onContextMenu = useCallback(
    (e: React.MouseEvent) => {
      rootInterface.node.onNodeContextMenu?.(e, node);
    },
    [node],
  );

  const updateNodeHandles = useCallback(() => {
    const [rect, handles] = getNodeInfo(ref, node);
    setNodeInternal((prev) => {
      return {
        ...prev,
        handles,
        rect,
      };
    });
  }, [node]);

  // built-in life cycle
  useEffect(() => {
    updateNodeHandles();
  }, []);

  const NodeComponent: NodeCom = templatePicker(node).reduce<any>((last, val) => {
    if (last[val]) return last[val];
    return BasicNode;
  }, templates);
  // console.log('render ==>', node.id);
  return (
    <Dragger
      x={x}
      y={y}
      getScale={rootInterface.getScale}
      onDragStart={dragStart}
      onDrag={drag}
      onDragEnd={dragEnd}
      nodeRef={ref}
    >
      <div
        className={`tail-node__wrapper ${styles.wrapper}`}
        style={style}
        ref={ref}
        onMouseOver={onHoverIn}
        onMouseLeave={onHoverOut}
        onClick={onNodeClick}
        onContextMenu={onContextMenu}
      >
        <NodeComponent
          node={node}
          hovered={hovered}
          selected={selected}
          selectedHandles={selectedHandles}
          updateNodeHandles={updateNodeHandles}
        />
      </div>
    </Dragger>
  );
};

// export default memo(NodeWrapper);
export default NodeWrapper;
