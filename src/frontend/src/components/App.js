import React, { useState, useEffect } from "react";
import {
	BrowserRouter as Router,
	Routes,
	Route,
	Redirect
} from "react-router-dom";
import Homepage from "./HomePage";
import Login from "./accounts/Login";
import Signup from './accounts/Signup';
import Compose from "./Compose";
import Nav from "./Nav";
import '../index.css'

export default function App(props) {

	const [username, setUsername] = useState()
	const [loggedIn, setLoggedIn] = useState(localStorage.getItem('token') ? true : false)

	function handleLogout() {
		localStorage.removeItem('token');
		setLoggedIn(false)
		setUsername('')
		window.location.href = '/'
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

	function loggedInRouter() {
		return (
			<Router>
				<Routes>
					<Route path='' element={<Homepage />} />
					<Route path='/login' element={<Login setLoggedIn={setLoggedIn} setUsername={setUsername} />} />
					<Route path='/signup' element={<Signup setLoggedIn={setLoggedIn} setUsername={setUsername} />} />
					<Route path='/compose' element={<Compose />} />
				</Routes>
			</Router>
		)
	}

	function loggedOutRouter() {
		return (
			<Router>
				<Routes>
					<Route path='' element={<Homepage />} />
					<Route path='/login' element={<Login setLoggedIn={setLoggedIn} setUsername={setUsername} />} />
					<Route path='/signup' element={<Signup setLoggedIn={setLoggedIn} setUsername={setUsername} />} />
				</Routes>
			</Router>
		)
	}

	return (
		<div>
			<Nav loggedIn={loggedIn} handleLogout={handleLogout} username={username}/>
			{loggedIn
				? loggedInRouter()
				: loggedOutRouter()
			}
		</div>
	)
}