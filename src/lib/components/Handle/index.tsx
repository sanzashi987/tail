import React, { Component } from 'react';
import type { HandleProps, InterfaceValue } from '@types';
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

  onMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    const { type, handleId, nodeId } = this.props;
    (this.context as InterfaceValue).handle.onMouseDown(e, type, nodeId, handleId);
  };

  onMouseUp = (e: React.MouseEvent) => {
    const { type, handleId, nodeId } = this.props;
    e.stopPropagation();
    (this.context as InterfaceValue).handle.onMouseDown(e, type, nodeId, handleId);
  };

  applyMouseActions = () => {
    if (this.props.disable) return {};
    return {
      onMouseDown: this.onMouseDown,
      onMouseUp: this.onMouseUp,
    } as const;
  };

  render() {
    const { handleId, nodeId, type, selected = false } = this.props;
    return (
      <div
        data-node-id={nodeId}
        data-handle-id={handleId}
        className={getHanldeClassName(type, selected)}
        // onMouseDown={this.onMouseDown}
        // onMouseUp={this.onMouseUp}
        {...this.applyMouseActions()}
      ></div>
    );
  }
}

export default Handle;
