import React, { useEffect, useState } from "react";

export default function Homepage(props) {

  const [email, setEmail] = useState()
  const [authNeeded, setAuthNeeded] = useState(false)

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

  useEffect(() => {
    getInfo()
  })

  return (
    <div id='homepage'>
      <h1>Email Automator</h1>

      <p className="subtitle">The hub for professionals</p>

      <p>Send emails to the masses, with just a click of a button. Including support for contacts, placeholders, scheduling, and much more.</p>

      {email
        ? <div className="card">{email}</div>
        : null
      }

      {!props.loggedIn
        ? <div className="card" style={{
          width: "fit-content",
          padding: "20px" 
        }}>
          <button onClick={() => window.location.href = '/login'}>Login</button>
          <br/>
          <br/>
          <button onClick={() => window.location.href = '/signup'}>Sign Up</button>
        </div>
        : null
      }

    </div>
  )
}
