import React from "react";

export default function HomePage(props) {

  function sendEmail() {
    fetch("/api/send/", {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${localStorage.getItem('token')}`
      },
    })
  }

  function authorize(){
    fetch("/api/auth/", {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `JWT ${localStorage.getItem('token')}`
      },
    })
    .then(response => response.json())
    .then(json => window.location.href = json.url)
  }

  return (
    <>
      <p>homepage</p>
      <button onClick={() => sendEmail()}>Send Email</button>
      <button onClick={() => authorize()}>Auth</button>
    </>
  )
}
