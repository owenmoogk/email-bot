import React, { Component, useState, useEffect } from "react";
import {
	BrowserRouter as Router,
	Switch,
	Route,
} from "react-router-dom";
import HomePage from "./HomePage";
import Login from "./accounts/Login";
import Signup from './accounts/Signup';

export default function App(props) {

	const [username, setUsername] = useState()
	const [loggedIn, setLoggedIn] = useState(localStorage.getItem('token') ? true : false)

	function handleLogout() {
		localStorage.removeItem('token');
		setLoggedIn(false)
		setUsername('')
	};

	useEffect(() => {
		if (loggedIn) {
			fetch('/users/current_user/', {
				headers: {
					Authorization: `JWT ${localStorage.getItem('token')}`
				}
			})
				.then(response => response.json())
				.then(json => {
					if (json.username) {
						setUsername(json.username)
					}
					else {
						handleLogout()
					}
				});
		}
	})

	return (
		<div>
			<p className='title'>{username}</p>
			<button onClick={handleLogout} style={{display: (loggedIn?'':'none')}}>Logout</button>
			<Router>
				<Switch>
					<Route path='/login'>
						<Login setLoggedIn={setLoggedIn} setUsername={setUsername} />
					</Route>
					<Route path='/signup'>
						<Signup setLoggedIn={setLoggedIn} setUsername={setUsername} />
					</Route>
					<Route path=''>
						<HomePage />
					</Route>
				</Switch>

			</Router>
		</div>
	)
}