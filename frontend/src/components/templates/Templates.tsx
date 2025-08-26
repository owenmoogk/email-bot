import { useFetchData } from '@api/getData';
import type { Template } from '@api/types/template';

export function Templates() {
  const templateData = useFetchData<Template[]>('/userdata/templates/');
  return (
    <div id="contactsPage" className="card">
      {templateData
        ? templateData.map((element, key) => {
            return (
              <a href={'/templates/' + element.id} key={key}>
                <b>{element.title}</b> --{' '}
                {element.template.substring(0, 20) + '...'}
              </a>
            );
          })
        : null}
      <button onClick={() => (window.location.href = '/templates/add')}>
        Add template
      </button>
    </div>
  );
}
