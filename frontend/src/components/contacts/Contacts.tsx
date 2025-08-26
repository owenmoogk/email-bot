import { useFetchData } from '@api/getData';
import type { ContactData } from '@api/types/contacts';

export function Contacts() {
  const contactData = useFetchData<ContactData[]>('/userdata/contacts/');

  return (
    <div id="contactsPage" className="card">
      {contactData
        ? contactData.map((element, key) => {
            return (
              <a href={'/contacts/' + element.id} key={key}>
                <b>{element.name}</b> -- {element.email}
              </a>
            );
          })
        : null}
      <button onClick={() => (window.location.href = '/contacts/add')}>
        Add Contact
      </button>
    </div>
  );
}
