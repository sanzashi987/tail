import React from 'react';
import type { EdgeRendererProps, Edge, EdgeAtomType } from '@lib/types';
import { EdgeInProgress, EdgeWrapper } from '@lib/components/Edge';
import styles from './index.module.scss';
import BasicRenderer from '../BasicRenderer';

const EdgeClassname = `tail-edge-container ${styles['edge-container']}`;

class EdgeRenderer extends BasicRenderer<EdgeRendererProps> {
  static defaultProps = { templates: {} };

  componentDidMount() {
    this.context.edgeUpdater.on('mount', this.mountEdge);
    this.context.edgeUpdater.on('delete', this.unmountEdge);
    this.context.edgeUpdater.on('rerender', this.updateMemoVNodes);
  }

  mountEdge = (edge: Edge, atom: EdgeAtomType) => {
    const { id } = edge;
    this.itemInstances[id] = <EdgeWrapper key={id} atom={atom} templates={this.props.templates} />;
  };

  unmountEdge = (edge: Edge) => {
    delete this.itemInstances[edge.id];
  };

  render() {
    return (
      <svg className={EdgeClassname}>
        {this.props.children /*for marker definition */}
        {this.memoVNodes}
        <EdgeInProgress template={this.props.connectingEdge} />
      </svg>
    );
  }
}

export default EdgeRenderer;
