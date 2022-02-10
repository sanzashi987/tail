import React, { Component, ComponentType } from 'react';
import { BasicNode, BasicFoldedNode } from '../../components/Node';
import type { FoldedNodeProps, Node, NodeRendererProps, TemplateNodeClass } from '@types';
const defaultProps = {
  templateIdentifier: (node: Node) => node.type,
  templates: {}
} as const

const defaultTemplate: TemplateNodeClass = {
  default: BasicNode,
  folded: BasicFoldedNode as any
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

// const mergeTemplatesWithDefault = createMemoTemplates()
class NodeRenderer extends Component<NodeRendererPropsWithDefaults> {

  memoTemplates: ReturnType<typeof createMemoTemplates>

  static defaultProps = defaultProps
  constructor(props: NodeRendererPropsWithDefaults) {
    super(props)
    this.memoTemplates = createMemoTemplates()
  }


  render() {
    const { nodes, templates, templateIdentifier, ...otherProps } = this.props

    const fullTemplates = this.memoTemplates(templates)
    return <div
      className="tail-node-container"
    >
      {nodes.reduce<React.ReactNode[]>((prev, node) => {
        const type = templateIdentifier(node)
        if (!type || !fullTemplates[type]) return prev
        const { default: template, folded: templateFolded } = fullTemplates[type]
        prev.push(
          <NodeContainer
            key={node.id}
            default={template}
            folded={templateFolded}
          />
        )
        return prev
      }, [])}
    </div>
  }
}

export default NodeRenderer