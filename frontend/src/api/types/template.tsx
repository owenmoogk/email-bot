export type TemplateBase = {
  template: string;
  title: string;
};

export type Template = TemplateBase & {
  id: string;
};
