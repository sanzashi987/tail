import React, {
  FC,
  CSSProperties,
  useRef,
  useMemo,
  useCallback,
  useEffect,
  useContext,
} from 'react';
import type { NodeWrapperProps, NodeCom, DraggerData } from '@app/types';
import { InstanceInterface } from '@app/contexts/instance';
import { setHovered, setNotHovered } from '@app/atoms/reducers';
import { useAtom } from 'jotai';
import Dragger from './Dragger';
import { getNodeInfo } from './utils';
import styles from './Wrapper.module.scss';
import { BasicNode } from '.';

const wrapperClassname = `tail-node__wrapper ${styles.wrapper}`;

const NodeWrapper: FC<NodeWrapperProps> = ({ atom, templatePicker, templates }) => {
  const [{ node, selected, selectedHandles, hovered }, setNodeInternal] = useAtom(atom);
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
      return rootInterface.node.onDragEnd?.(e, node, c);
    },
    [node],
  );

  const onNodeClick = (e: React.MouseEvent) => {
    // e.stopPropagation();
    rootInterface.activateItem(e, 'node', node.id, selected);
    rootInterface.node.onNodeClick?.(e, node);
  };
  const onHoverIn = () => {
    !hovered && setNodeInternal(setHovered);
  };
  const onHoverOut = () => {
    hovered && setNodeInternal(setNotHovered);
  };

  const onContextMenu = (e: React.MouseEvent) => {
    rootInterface.node.onNodeContextMenu?.(e, node);
  };

  const updateNodeHandles = useCallback(() => {
    const scale = rootInterface.getScale();
    const [rect, handles] = getNodeInfo(ref, node, scale);
    // console.log(rect);
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
    return () => rootInterface.activateItem(null, 'node', node.id, false, true);
  }, []);

  const NodeComponent: NodeCom = useMemo(() => {
    return templatePicker(node).reduce<any>((last, val) => {
      if (last[val]) return last[val];
      return BasicNode;
    }, templates);
  }, [templatePicker, node]);

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
        className={wrapperClassname}
        style={style}
        ref={ref}
        onMouseEnter={onHoverIn}
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
