import type { Node, TemplateNodeClass } from '@types';
import { BasicNode, BasicFoldedNode } from '../../components/Node';


export const defaultProps = {
  templatePicker: (node: Node) => [node.type, node.fold ? 'folded' : 'default'],
  templates: {},
} as const;

const defaultTemplate: TemplateNodeClass = {
  default: BasicNode,
  folded: BasicFoldedNode,
};

const defaultTemplates = { logical: defaultTemplate };


export function createMemoTemplates() {
  let lastTemplates: IObject<TemplateNodeClass>, lastRes: IObject<TemplateNodeClass>;
  return function (templates: IObject<TemplateNodeClass>) {
    if (templates !== lastTemplates) {
      lastTemplates = templates;
      lastRes = { ...defaultTemplates, ...templates };
    }
    return lastRes;
  };
}