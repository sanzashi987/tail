import React, { Component } from 'react';
import type { HandleProps, InterfaceValue } from '@lib/types';
import { InstanceInterface } from '@lib/contexts/instance';
import styles from './index.module.scss';

type HandlePropsInner = HandleProps;

function getHanldeClassName(type: string, selected: boolean) {
  let className = `tail-handle__reserved ${styles.handle} ${type}`;
  if (selected) className += ' selected';
  return className;
}
class Handle extends Component<HandlePropsInner> {
  static contextType = InstanceInterface;
  context!: InterfaceValue;

  createContextHandler = (name: keyof InterfaceValue['handle']) => (e: React.MouseEvent) => {
    e.stopPropagation();
    const { type, handleId, nodeId, describer } = this.props;
    this.context.handle[name](e, type, nodeId, handleId, describer);
  };

  handlers = {
    onMouseDown: this.createContextHandler('onMouseDown'),
    onMouseUp: this.createContextHandler('onMouseUp'),
    onMouseEnter: this.createContextHandler('onMouseEnter'),
    onMouseLeave: this.createContextHandler('onMouseLeave'),
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
