import React, { Component, ComponentType } from 'react';
import { BasicNode, BasicFoldedNode, NodeWrapper } from '../../components/Node';
import type { Node, NodeRendererProps, TemplateNodeClass } from '@types';
const defaultProps = {
  templatePicker: (node: Node) => [node.type, node.fold ? 'folded' : 'default'],
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
    const { nodes, templates, templatePicker, ...otherProps } = this.props
    return <div
      className="tail-node-container"
    >
      {nodes.map((id) => <NodeWrapper key={id} id={id} />)}
    </div>
  }
}

export default NodeRenderer