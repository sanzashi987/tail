import React, { Component } from 'react';
import type { HandleProps, InterfaceValue } from '@lib/types';
import styles from './index.module.scss';
import { InstanceInterface } from '../../contexts/instance';

type HandlePropsInner = HandleProps;

function getHanldeClassName(type: string, selected: boolean) {
  let className = `tail-handle__reserved ${styles.handle} ${type}`;
  if (selected) className += ' selected';
  return className;
}
class Handle extends Component<HandlePropsInner> {
  static contextType = InstanceInterface;
  declare context: InterfaceValue;

  onMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    const { type, handleId, nodeId, describer } = this.props;
    this.context.handle.onMouseDown(e, type, nodeId, handleId, describer);
  };

  onMouseUp = (e: React.MouseEvent) => {
    const { type, handleId, nodeId, describer } = this.props;
    e.stopPropagation();
    this.context.handle.onMouseUp(e, type, nodeId, handleId, describer);
  };

  handlers = {
    onMouseDown: this.onMouseDown,
    onMouseUp: this.onMouseUp,
  };

  applyMouseActions = () => {
    if (this.props.disable) return {};
    return this.handlers;
  };

  render() {
    const { handleId, nodeId, type, selected = false } = this.props;
    return (
      <div
        data-node-id={nodeId}
        data-handle-id={handleId}
        className={getHanldeClassName(type, selected)}
        {...this.applyMouseActions()}
      ></div>
    );
  }
}

export default Handle;
