import React, { useEffect, useState } from "react";

export default function Compose(props) {

  const [email, setEmail] = useState()
  const [authNeeded, setAuthNeeded] = useState(false)

  const [templateData, setTemplateData] = useState()
  const [contactData, setContactData] = useState()
  const [completedContactData, setCompletedContactData] = useState()

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
    return (templateVariables)
  }

  function sendEmail() {

    // updating the user data
    var requests = []
    var tmpContactData = JSON.parse(JSON.stringify(completedContactData))
    for (var contact of tmpContactData) {
      
      // checking to make sure all the variables are satisfied
      var tmpVarsNeeded = new Set([...variablesNeeded])
      for (var contactVariable of contact.variables){
        if (contactVariable.value){
          tmpVarsNeeded.delete(contactVariable.name)
        }
        else{
          console.log('blank values')
          return
        }
      }
      if (tmpVarsNeeded.size != 0){
        console.log('does not exist')
        return
      }

      var id = contact.id
      delete contact.id
      requests.push(
        fetch("/userdata/contact/edit/" + id + '/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `JWT ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(contact)
        })
      )
    }
    Promise.all(requests).then(() => {
      fetch("/api/schedule/", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          contacts: [...selectedContacts],
          template: selectedTemplate,
          time: document.getElementById('sendTime').value
        })
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
      .then(json => { setTemplateData(json); setTemplateVars(getVariables(json)) })
  }

  function getContacts() {
    fetch("/userdata/contacts/", {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${localStorage.getItem('token')}`
      }
    })
      .then(response => response.json())
      .then(json => { setContactData(json); setCompletedContactData(json) })
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
                <label for={element.title}><input type='radio' id={element.title} name='template' value={element.id} onChange={() => { setSelectedTemplate(element.id); setVariablesNeeded(templateVars[element.id]) }} />{element.title}</label>
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

      <h2>Step 3</h2>

      <p>Complete unfinished variables</p>

      {selectedContacts && contactData && variablesNeeded && completedContactData
        ? [...selectedContacts].map((element) => {

          // element is just a id of the contact, we have to retrieve it
          for (var i = 0; i < contactData.length; i++) {

            // getting each contact from the list
            var contact = contactData[i]

            // if we have selected the current contact
            if (contact.id == parseInt(element)) {
              return (
                // for each variable that is required
                <p>{contact.name} -- Variables left: {[...variablesNeeded].map((variableNeeded) => {

                  // check if contact contains this variable, if so return nothing
                  for (var variable of contact.variables) {
                    if (variable.name == variableNeeded) {
                      return
                    }
                  }

                  // if it doesn't contain this variable, we return an input field for it
                  return (
                    <>
                      <span>{variableNeeded} </span>
                      <input placeholder={variableNeeded} className="variableInput" onChange={(e) => {

                        // when the input field changes, we need to update the data, and eventually make a post request
                        var tmpContactData = JSON.parse(JSON.stringify(completedContactData))

                        // if this variable has already been updated, we need to change it once again
                        for (var j = 0; j < tmpContactData[i].variables.length; j++) {
                          var variable = tmpContactData[i].variables[j]
                          if (variable.name == variableNeeded) {
                            variable.value = e.target.value
                            setCompletedContactData(tmpContactData)
                            return
                          }
                        }
                        // but if is not in there, we need to add it
                        tmpContactData[i].variables.push({
                          name: variableNeeded,
                          value: e.target.value
                        })
                        setCompletedContactData(tmpContactData)
                      }}></input>
                    </>
                  )
                })}</p>
              )
            }
          }
        })
        : null
      }

      <input type="datetime-local" id="sendTime" defaultValue="2022-01-01T12:00"></input>
      <br/>
      <button onClick={() => sendEmail()}>Send Email</button>
    </>
  )
}
