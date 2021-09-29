import React, { Component, useState } from "react";
import { Redirect } from "react-router";

export default function Logout() {

    const [doRedirect, setDoRedirect] = useState()

    fetch('/accountsAPI/logout')
        .then(response => response.status)
        .then(status => {
            if (status == 200) {
                setDoRedirect(true)
            }
        })

    return (
        <>
            {doRedirect
                ? <Redirect to='/' />
                : <p>Loading.....</p>
            }
        </>
    )
}