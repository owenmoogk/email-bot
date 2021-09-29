import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";
import Login from "./Login";
import Logout from "./Logout";

export default function AccountRouter(props) {
  return(
    <Router>
      <Switch>
        <Route path='/accounts/login'>
          <Login/>

        </Route>
        <Route path='/accounts/logout'>
          <Logout/>
        </Route>
        <Route path='/accounts/signup'>
          <p>signup</p>
        </Route>
      </Switch>
    </Router>
  )
}
