import React from 'react';

export default function Nav(props) {

    function loggedInNav() {
        return (
            <>
                <a href='/'>Home</a>
                <a href='/compose'>Compose</a>
                <a href='/contacts'>Contacts</a>
                <a href='/templates'>Templates</a>
                <button onClick={props.handleLogout}>Logout</button>
                <a>{props.username}</a>
            </>
        )
    }

    function loggedOutNav() {
        return (
            <>
                <a href='/'>Home</a>
                <a href='/login'>Login</a>
                <a href='/signup'>Signup</a>
            </>
        )
    }

    return (
        <div id='nav'>
            {props.loggedIn
                ? loggedInNav()
                : loggedOutNav()
            }
        </div>
    )
}