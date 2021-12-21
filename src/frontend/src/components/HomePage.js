import React from "react";

export default function Homepage(props) {

  function sendEmail() {
    fetch("/api/send/", {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${localStorage.getItem('token')}`
      },
    })
  }

  function test(){
    fetch("/api/schedule/", {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${localStorage.getItem('token')}`
      },
    })
    .then(response => response.json())
    .then(json => console.log(json))
  }

  return (
    <>
      <h1>Email Automator</h1>

      <p className="subtitle">The hub for professionals</p>

      <p>Send emails to the masses, with just a click of a button. Including support for contacts, placeholders, scheduling, and much more/</p>

      <button onClick={() => sendEmail()}>Send Email</button>
      <button onClick={() => test()}>Test</button>
    </>
  )
}
