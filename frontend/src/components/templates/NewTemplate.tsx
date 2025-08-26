import { postData } from '@api/postData';
import type { TemplateBase } from '@api/types/template';
import type { SubmitHandler } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import { formatTemplate, formatText } from './util';

export function NewTemplate() {
  const { register, handleSubmit } = useForm<TemplateBase>();
  const saveTemplate: SubmitHandler<TemplateBase> = (data) => {
    const formattedTemplate = formatTemplate(data);
    void postData('/userdata/addtemplate/', formattedTemplate).then(() => {
      window.location.href = '/templates/';
    });
  };

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={handleSubmit(saveTemplate)}>
      Title: <input {...register('title')} placeholder="Title" />
      <br />
      <textarea
        style={{
          height: '200px',
          width: '200px',
        }}
        {...register('template')}
        onChange={(e) => (e.target.value = formatText(e.target.value))}
      />
      <button type="submit">Save Template</button>
    </form>
  );
}
