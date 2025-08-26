import type { TemplateBase } from '@api/types/template';

export function formatTemplate(template: TemplateBase) {
  const variables = new Set<string>();
  let text = template.template;
  for (let i = 0; i < text.length; i++) {
    if (text.charAt(i) === '{') {
      let variable = '{';
      while (text.charAt(i) !== '}') {
        i += 1;
        if (i >= text.length) {
          break;
        }
        variable += text.charAt(i);
      }
      variables.add(variable);
    }
  }
  for (const variable of variables) {
    text = text.replaceAll(variable, variable.toUpperCase());
  }
  return template;
}

export function formatText(text: string) {
  const variables = new Set<string>();
  for (let i = 0; i < text.length; i++) {
    if (text.charAt(i) === '{') {
      let variable = '{';
      while (text.charAt(i) !== '}') {
        i += 1;
        if (i >= text.length) {
          break;
        }
        variable += text.charAt(i);
      }
      if (text.charAt(i) === '}') {
        variables.add(variable);
      }
    }
  }
  for (const variable of variables) {
    const newVar = variable.substring(1, variable.length - 1);
    text = text.replaceAll(variable, `{${newVar.toUpperCase()}}`);
  }
  return text;
}
