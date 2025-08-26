import { useState } from 'react';

export function EditContact() {
  const [data, setData] = useState();

  function getContact(id) {
    void fetch(API_URL + '/userdata/contact/' + id + '/', {
      headers: authHeader,
    })
      .then(async (response) => response.json())
      .then((json) => {
        if (json.name && json.email) {
          setData(json);
        } else {
          window.location.href = '/404';
        }
      });
  }

  function saveContact(id) {
    const tmpData = { ...data };
    for (const variable of tmpData.variables) {
      variable['name'] = variable['name'].toUpperCase();
    }

    fetch(API_URL + '/userdata/contact/edit/' + id + '/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(tmpData),
    })
      .then(async (response) => response.json())
      .then((json) => {
        console.log(json);
      });
  }

  function addVariable() {
    const varName = document.getElementById('varNameInput').value;
    const varValue = document.getElementById('varValueInput').value;

    for (const i of document.getElementById('variables').childNodes) {
      if (i.childNodes[0].value == varName) {
        return;
      }
    }

    const tmpData = { ...data };
    tmpData.variables.push({ name: varName, value: varValue });
    setData(tmpData);
  }

  function deleteContact(id) {
    fetch(API_URL + '/userdata/contact/delete/' + id + '/', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(async (response) => response.json())
      .then((json) => (window.location.href = '/contacts/'));
  }

  const { id } = useParams();

  useEffect(() => {
    getContact(id);
  }, []);

  useEffect(() => {
    console.log(data);
  });

  return (
    <>
      {data ? (
        <>
          Name:{' '}
          <input
            type="text"
            id="nameInput"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
          />
          Email:{' '}
          <input
            type="text"
            id="emailInput"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
          />
          <br />
          <br />
          <div id="variables">
            {data.variables.map((variable, key) => {
              return (
                <span id="variableContainer">
                  <input
                    type="text"
                    id="variableName"
                    value={variable.name}
                    key={key}
                    onChange={(e) => {
                      // searching thru the variable array to find the right one
                      const tmpData = { ...data };
                      for (let i = 0; i < tmpData.variables.length; i++) {
                        if (tmpData.variables[i].name == variable.name) {
                          tmpData.variables[i].name = e.target.value;
                          break;
                        }
                      }
                      setData(tmpData);
                    }}
                  />
                  <input
                    type="text"
                    id="variableValue"
                    value={variable.value}
                    key={key}
                    onChange={(e) => {
                      // searching thru the variable array to find the right one
                      const tmpData = { ...data };
                      for (let i = 0; i < tmpData.variables.length; i++) {
                        if (tmpData.variables[i].value == variable.value) {
                          tmpData.variables[i].value = e.target.value;
                          break;
                        }
                      }
                      setData(tmpData);
                    }}
                  />
                  <br />
                </span>
              );
            })}
          </div>
        </>
      ) : null}

      <div>
        <br />
        Variables
        <br />
        Name: <input type="text" id="varNameInput" placeholder="Name" />
        Value: <input type="text" id="varValueInput" placeholder="Value" />
        <button onClick={() => addVariable()}>Add variable</button>
      </div>

      <br />
      <br />
      <button onClick={() => saveContact(id)}>Save Contact</button>
      <button onClick={() => deleteContact(id)}>Delete Contact</button>
    </>
  );
}
