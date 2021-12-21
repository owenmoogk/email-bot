import React, { useEffect, useState } from "react";

export default function Compose(props) {

  const [email, setEmail] = useState()
  const [authNeeded, setAuthNeeded] = useState(false)

  function sendEmail() {
    fetch("/api/send/", {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${localStorage.getItem('token')}`
      },
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

  useEffect(() => {
    getInfo()
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

      <button onClick={() => sendEmail()}>Send Email</button>
    </>
  )
}
