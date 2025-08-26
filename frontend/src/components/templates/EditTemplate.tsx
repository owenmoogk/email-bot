import { fetchJson, useFetchData } from '@api/getData';
import { useParams } from 'react-router';
import { formatTemplate, formatText } from './util';
import { useForm } from 'react-hook-form';
import type { Template } from '@api/types/template';
import { postData } from '@api/postData';

export function EditTemplate() {
  const { id } = useParams();
  const template = useFetchData<Template>(
    '/userdata/template/' + (id ?? '') + '/'
  );
  if (!id || !template) return;

  return <EditTemplateForm {...template} />;
}

function EditTemplateForm(template: Template) {
  const { id } = template;
  const saveTemplate = () => {
    const formattedTemplate = formatTemplate(template);
    void postData(
      '/userdata/template/edit/' + id + '/',
      formattedTemplate
    ).then((json) => console.log(json));
  };

  const { register, handleSubmit } = useForm<Template>({
    defaultValues: template,
  });

  function deleteTemplate() {
    void fetchJson('/userdata/template/delete/' + id + '/').then(
      () => (window.location.href = '/templates/')
    );
  }

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
      <button onClick={deleteTemplate}>Delete Template</button>
    </form>
  );
}
