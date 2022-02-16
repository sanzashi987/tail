import React, { Component, ComponentType, ReactNode } from 'react';
import { BasicNode, BasicFoldedNode, NodeWrapper } from '../../components/Node';
import type { Node, NodeAtom, NodeRendererProps, TemplateNodeClass } from '@types';
import { RecoilState } from 'recoil';
const defaultProps = {
  templatePicker: (node: Node) => [node.type, node.fold ? 'folded' : 'default'],
  templates: {}
} as const

const defaultTemplate: TemplateNodeClass = {
  default: BasicNode,
  folded: BasicFoldedNode
}

const defaultTemplates = { 'logical': defaultTemplate }

type NodeRendererPropsWithDefaults = NodeRendererProps & typeof defaultProps

type Nodes = NodeRendererProps['nodes']

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
  static defaultProps = defaultProps

  memoTemplates: ReturnType<typeof createMemoTemplates>

  nodeAtoms: IObject<RecoilState<NodeAtom>> = {}
  nodeInstances: IObject<ReactNode> = {}
  memoNodes: ReactNode

  constructor(props: NodeRendererPropsWithDefaults) {
    super(props)
    this.memoTemplates = createMemoTemplates()
  }

  shouldComponentUpdate(nextProps: NodeRendererPropsWithDefaults) {
    if (nextProps.nodes !== this.props.nodes) {
      this.diffNodes(nextProps.nodes, this.props.nodes)
      return true
    }
    return true
  }

  updateNodesNode = () => {
    this.memoNodes = Object.keys(this.nodeInstances).map(k => this.nodeInstances[k])
  }

  diffNodes(nextNodes: Nodes, lastNodes: Nodes) {

  }


  mountNode = (node: Node) => {
    const { id } = node
    
  }

  updateNode = (lastNode: Node, newNode: Node) => {

  }

  unmountNode = (node: Node) => {

  }


  render() {
    const { nodes, templates, templatePicker, ...otherProps } = this.props
    return <div
      className="tail-node-container"
    >
      {this.memoNodes}
    </div>
  }
}

export default NodeRenderer