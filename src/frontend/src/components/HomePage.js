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

  return (
    <>
      <p>homepage</p>
      <button onClick={() => sendEmail()}>Send Email</button>
    </>
  )
}
