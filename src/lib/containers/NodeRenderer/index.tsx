import React, { Component, ComponentType } from 'react';
import { NodeWrapper, BasicNode, BasicFoldedNode } from '../../components/Node';
import type { FoldedNodeProps, Node, NodeRendererProps, TemplateNodeClass } from '@types';

const defaultProps = {
  templateIdentifier: (node: Node) => node.type,
  templates: {}
} as const

const defaultTemplate: TemplateNodeClass = {
  default: BasicNode,
  folded: BasicFoldedNode as unknown as ComponentType<FoldedNodeProps>
}

const defaultTemplates = { 'logical': defaultTemplate }

type NodeRendererPropsWithDefaults = NodeRendererProps & typeof defaultProps



function createMemoTemplates() {
  let lastTemplates: IObject<TemplateNodeClass>, lastRes: IObject<TemplateNodeClass>
  return function (templates: IObject<TemplateNodeClass>) {
    if (templates !== lastTemplates) {
      lastTemplates = templates
      lastRes = { ...defaultTemplates, ...templates }
    }
    return lastRes
  }
}

const mergeTemplatesWithDefault = createMemoTemplates()
class NodeRenderer extends Component<NodeRendererPropsWithDefaults> {
  
  static defaultProps = defaultProps


  render() {
    const { nodes, templates, templateIdentifier, ...otherProps } = this.props

    const fullTemplates = mergeTemplatesWithDefault(templates)
    return <div
      className="tail-node-container"
    >
      {nodes.reduce<React.ReactNode[]>((prev, node) => {
        const type = templateIdentifier(node)
        if (!type || !fullTemplates[type]) return prev
        const { default: template, folded: templateFolded } = fullTemplates[type]
        
        return prev
      }, [])}
    </div>
  }
}

export default NodeRenderer