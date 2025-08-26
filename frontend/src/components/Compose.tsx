import { API_URL } from '@global/global';
import { fetchJson, useFetchData } from '@api/getData';
import type { AccountInfo, Auth } from '@api/types/user';

export function Compose() {
  function getVariables(templates) {
    const templateVariables = {};
    for (const template of templates) {
      const text = template.template;

      // getting the variables
      const variables = new Set();
      for (let i = 0; i < text.length; i++) {
        if (text.charAt(i) == '{') {
          let variable = '';
          i += 1;
          while (text.charAt(i) != '}') {
            variable += text.charAt(i);
            i += 1;
            if (i >= text.length) {
              break;
            }
          }
          variables.add(variable);
        }
      }

      templateVariables[template.id] = variables;
    }
    return templateVariables;
  }

  function sendEmail() {
    // updating the user data
    const requests = [];
    const tmpContactData = JSON.parse(JSON.stringify(completedContactData));
    for (const contact of tmpContactData) {
      // if the contact is selected
      if (selectedContacts.has(contact.id)) {
        // checking to make sure all the variables are satisfied
        const tmpVarsNeeded = new Set([...variablesNeeded]);
        for (const contactVariable of contact.variables) {
          if (contactVariable.value) {
            tmpVarsNeeded.delete(contactVariable.name);
          } else {
            console.log('blank values');
            return;
          }
        }
        if (tmpVarsNeeded.size !== 0) {
          console.log('does not exist');
          return;
        }
      }

      const id = contact.id;
      delete contact.id;
      requests.push(
        fetch(API_URL + '/userdata/contact/edit/' + id + '/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(contact),
        })
      );
    }
    void Promise.all(requests).then(() => {
      void fetch(API_URL + '/api/schedule/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          contacts: [...selectedContacts],
          template: selectedTemplate,
          time: document.getElementById('sendTime').disabled
            ? null
            : document.getElementById('sendTime').value,
        }),
      });
    });
  }

  async function authorize() {
    const json = await fetchJson<Auth>('/api/auth');
    window.location.href = json.url;
  }

  const userInfo = useFetchData<AccountInfo>('/api/accountInfo');

  const templates = useFetchData<Template>('/userdata/templates');
  // setTemplateData(json);
  // setTemplateVars(getVariables(json));

  const contacts = useFetchData<Contacts>('/userdata/contacts');

  return (
    <div id="compose">
      <h1>Compose</h1>

      {email ? <p className="subtitle">{email}</p> : null}
      {authNeeded ? (
        <button onClick={async () => authorize()}>
          Connect an email address
        </button>
      ) : null}

      <h2>Step 1</h2>

      <p>Choose a template</p>

      <div id="templates" className="card">
        {templateData
          ? templateData.map((element, key) => {
              return (
                <>
                  <label htmlFor={element.title}>
                    <input
                      type="radio"
                      id={element.title}
                      name="template"
                      value={element.id}
                      onChange={() => {
                        setSelectedTemplate(element.id);
                        setVariablesNeeded(templateVars[element.id]);
                      }}
                    />
                    {element.title}
                  </label>
                  <br />
                </>
              );
            })
          : null}
      </div>

      <h2>Step 2</h2>

      <p>Select Contacts</p>

      <div id="contacts" className="card">
        {contactData
          ? contactData.map((element, key) => {
              return (
                <>
                  <label>
                    <input
                      type="checkbox"
                      onClick={(e) => {
                        if (e.target.checked) {
                          var tmpContacts = new Set([...selectedContacts]);
                          tmpContacts.add(element.id);
                          setSelectedContacts(tmpContacts);
                        } else {
                          var tmpContacts = new Set([...selectedContacts]);
                          tmpContacts.delete(element.id);
                          setSelectedContacts(tmpContacts);
                        }
                      }}
                      name="contact"
                      value={element.id}
                    />
                    {element.name} -- {element.email}
                  </label>
                  <br />
                </>
              );
            })
          : null}
      </div>

      <p>Complete unfinished variables</p>

      {selectedContacts &&
      contactData &&
      variablesNeeded &&
      completedContactData
        ? [...selectedContacts].map((element) => {
            // element is just a id of the contact, we have to retrieve it
            for (var i = 0; i < contactData.length; i++) {
              // getting each contact from the list
              var contact = contactData[i];

              // if we have selected the current contact
              if (contact.id == parseInt(element)) {
                // this bit here is checking if ALL the variables are met, if so we do not need to show the 'variables left' text
                for (const variableNeeded of [...variablesNeeded]) {
                  let variableMatched = false;
                  for (const variable of contact.variables) {
                    if (variable.name == variableNeeded) {
                      variableMatched = true;
                      break;
                    }
                  }

                  // if this contact is missing at least one variable, then we need to render this, and allow the user to fix it
                  if (!variableMatched) {
                    return (
                      // for each variable that is required
                      <p>
                        {contact.name} -- Variables left:{' '}
                        {[...variablesNeeded].map((variableNeeded) => {
                          // check if contact contains this variable, if so return nothing
                          for (const variable of contact.variables) {
                            if (variable.name == variableNeeded) {
                              return;
                            }
                          }

                          // if it doesn't contain this variable, we return an input field for it
                          return (
                            <>
                              <span>{variableNeeded} </span>
                              <input
                                placeholder={variableNeeded}
                                className="variableInput"
                                onChange={(e) => {
                                  // when the input field changes, we need to update the data, and eventually make a post request
                                  const tmpContactData = JSON.parse(
                                    JSON.stringify(completedContactData)
                                  );

                                  // if this variable has already been updated, we need to change it once again
                                  for (
                                    let j = 0;
                                    j < tmpContactData[i].variables.length;
                                    j++
                                  ) {
                                    const variable =
                                      tmpContactData[i].variables[j];
                                    if (variable.name == variableNeeded) {
                                      variable.value = e.target.value;
                                      setCompletedContactData(tmpContactData);
                                      return;
                                    }
                                  }
                                  // but if is not in there, we need to add it
                                  tmpContactData[i].variables.push({
                                    name: variableNeeded,
                                    value: e.target.value,
                                  });
                                  setCompletedContactData(tmpContactData);
                                }}
                              />
                            </>
                          );
                        })}
                      </p>
                    );
                  }
                }
              }
            }
          })
        : null}

      <h2>Step 3</h2>
      <label>
        <input
          type="checkbox"
          onChange={(e) => {
            if (e.target.checked) {
              document.getElementById('sendTime').disabled = false;
            } else {
              document.getElementById('sendTime').disabled = true;
            }
          }}
        />{' '}
        Schedule Email
      </label>
      <input
        type="datetime-local"
        id="sendTime"
        disabled
        defaultValue={new Date().toISOString().slice(0, -14) + 'T12:00'}
        min={new Date().toISOString().slice(0, -8)}
      />
      <br />
      <button onClick={() => sendEmail()}>Send Email</button>
    </div>
  );
}
