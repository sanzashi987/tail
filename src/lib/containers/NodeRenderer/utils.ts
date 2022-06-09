import type { Node, TemplateNodeClass } from '@lib/types';
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
  let lastTemplates: Record<string, TemplateNodeClass>, lastRes: Record<string, TemplateNodeClass>;
  return function (templates: Record<string, TemplateNodeClass>) {
    if (templates !== lastTemplates) {
      lastTemplates = templates;
      lastRes = { ...defaultTemplates, ...templates };
    }
    return lastRes;
  };
}
