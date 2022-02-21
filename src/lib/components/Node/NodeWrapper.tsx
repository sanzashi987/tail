import React, {
  FC,
  CSSProperties,
  useRef,
  useMemo,
  useState,
  useCallback,
  useEffect,
  useContext,
  memo,
} from 'react';
import type { NodeWrapperProps, coordinates, NodeCom } from '@types';
import { InstanceInterface } from '@app/contexts/instance';
import { useRecoilState } from 'recoil';
import Dragger from './Dragger';
import { getHandlesPosition } from './utils';
import styles from './Wrapper.module.scss';
import { BasicNode } from '.';

const NodeWrapper: FC<NodeWrapperProps> = ({ atom, templatePicker, templates }) => {
  const [{ node, selected, selectedHandles }, setNodeInternal] = useRecoilState(atom);
  const ref = useRef<HTMLDivElement>(null);
  const rootInterface = useContext(InstanceInterface)!;
  const [{ x, y }, setCoordinate] = useState({ x: node.left, y: node.top });
  if (node.left !== x || node.top !== y) {
    setCoordinate({ x: node.left, y: node.top });
  }
  const style = useMemo(() => {
    return {
      transform: `translate(${x}px,${y}px)`,
    } as CSSProperties;
  }, [x, y]);

  //built-in event callbacks
  const dragStart = useCallback(
    (e: React.MouseEvent, c: coordinates) => {
      return rootInterface.node.onDragStart(e, node, c);
    },
    [node],
  );
  const drag = useCallback(
    (e: MouseEvent, c: coordinates) => {
      setCoordinate(c);
      return rootInterface.node.onDrag(e, node, c);
    },
    [node],
  );
  const dragEnd = useCallback(
    (e: MouseEvent, c: coordinates) => {
      setCoordinate(c);
      return rootInterface.node.onDragEnd(e, node, c);
    },
    [node],
  );
  const onNodeSelect = useCallback(
    (e: React.MouseEvent) => {
      if (selected) {
        rootInterface.activateItem(e, 'node', node.id);
      }
      rootInterface.node.onNodeClick(e, node);
    },
    [node.id],
  );
  const updateNodeInternal = useCallback(() => {
    const handles = getHandlesPosition(ref, node);
    setNodeInternal((prev) => {
      return {
        ...prev,
        handles,
      };
    });
  }, [node]);

  // built-in life cycle
  useEffect(() => {
    updateNodeInternal();
  }, [updateNodeInternal]);

  const NodeComponent: NodeCom = templatePicker(node).reduce<any>((last, val) => {
    if (last[val]) return last[val];
    return BasicNode;
  }, templates);
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
        onClick={onNodeSelect}
      >
        <NodeComponent
          node={node}
          selected={selected}
          selectedHandles={selectedHandles}
          updateNodeInternal={updateNodeInternal}
        />
      </div>
    </Dragger>
  );
};

// export default memo(NodeWrapper);
export default NodeWrapper;
