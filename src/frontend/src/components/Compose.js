import React, { useEffect, useState } from "react";

export default function Compose(props) {

  const [email, setEmail] = useState()
  const [authNeeded, setAuthNeeded] = useState(false)

  const [templateData, setTemplateData] = useState()
  const [contactData, setContactData] = useState()

  const [variablesNeeded, setVariablesNeeded] = useState()
  const [templateVars, setTemplateVars] = useState()

  const [selectedTemplate, setSelectedTemplate] = useState()
  const [selectedContacts, setSelectedContacts] = useState(new Set())

  function getVariables(templates) {
    var templateVariables = {}
    for (var template of templates) {
      var text = template.template

      // getting the variables
      var variables = new Set()
      for (var i = 0; i < text.length; i++) {
        if (text.charAt(i) == '{') {
          var variable = ''
          i += 1
          while (text.charAt(i) != '}') {
            variable += text.charAt(i)
            i += 1
            if (i >= text.length) {
              break
            }
          }
          variables.add(variable)
        }
      }

      templateVariables[template.id] = variables

    }
    setTemplateVars(templateVariables)
  }

  function sendEmail() {
    fetch("/api/send/", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        contacts: [...selectedContacts],
        template: selectedTemplate
      })
    })
  }

  function authorize() {
    fetch("/api/auth/", {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${localStorage.getItem('token')}`
      },
    })
      .then(response => response.json())
      .then(json => window.location.href = json.url)
  }

  function getInfo() {
    fetch("/api/accountInfo/", {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${localStorage.getItem('token')}`
      },
    })
      .then(response => response.json())
      .then(json => {
        if (json.address) {
          setEmail(json.address)
        }
        if (json.error) {
          setAuthNeeded(true)
        }
      })
  }

  function getTemplates() {
    fetch("/userdata/templates/", {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${localStorage.getItem('token')}`
      }
    })
      .then(response => response.json())
      .then(json => { setTemplateData(json); setVariablesNeeded(getVariables(json)) })
  }

  function getContacts() {
    fetch("/userdata/contacts/", {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${localStorage.getItem('token')}`
      }
    })
      .then(response => response.json())
      .then(json => setContactData(json))
  }

  useEffect(() => {
    getInfo()
    getTemplates()
    getContacts()
  }, [])

  return (
    <>
      <h1>Compose</h1>

      {email
        ? <p className="subtitle">{email}</p>
        : null
      }
      {authNeeded
        ? <button onClick={() => authorize()}>Connect an email address</button>
        : null
      }

      <h2>Step 1</h2>

      <p>Choose a template</p>

      <div id="templates">
        {templateData
          ? templateData.map((element, key) => {
            return (
              <>
                <label for={element.title}><input type='radio' id={element.title} name='template' value={element.id} onChange={() => { setSelectedTemplate(element.id); setVariablesNeeded(templateVars[element.id]); console.log(templateVars[element.id]) }} />{element.title}</label>
                <br />
              </>
            )
          })
          : null
        }
      </div>

      <h2>Step 2</h2>

      <p>Select Contacts</p>

      <div id='contacts'>
        {contactData
          ? contactData.map((element, key) => {
            return (
              <>
                <label><input type='checkbox' onClick={(e) => {
                  if (e.target.checked) {
                    var tmpContacts = new Set([...selectedContacts])
                    tmpContacts.add(element.id)
                    setSelectedContacts(tmpContacts)
                  }
                  else {
                    var tmpContacts = new Set([...selectedContacts])
                    tmpContacts.delete(element.id)
                    setSelectedContacts(tmpContacts)
                  }
                }} name='contact' value={element.id} />{element.name} -- {element.email}</label>
                <br />
              </>
            )
          })
          : null
        }
      </div>

      <h3>Step 3</h3>

      <p>Complete unfinished variables</p>

      {selectedContacts && contactData && variablesNeeded
        ? [...selectedContacts].map((element) => {
          // element is just a id of the contact, we have to retrieve it
          for (var contact of contactData) {
            if (contact.id == parseInt(element)) {
              return (
                <p>{contact.name} -- Variables left: {[...variablesNeeded].map((variableNeeded) => {
                  console.log(contact.name, contact.variables)
                  // loop thru each variable and check if it contains it
                  for (var variable of contact.variables){
                    if (variable.name == variableNeeded){
                      return
                    }
                  }
                  return(<span>{variableNeeded}   </span>)
                })}</p>
              )
            }
          }
        })
        : null
      }

      <button onClick={() => sendEmail()}>Send Email</button>
    </>
  )
}
