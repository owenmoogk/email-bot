import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import HomePage from "./HomePage";
import AccountRouter from "./accounts/AccountRouter";

export default function App(props) {
  return (
    <div>
      <Router>
        <Switch>
          <Route path='/accounts'>
            <p>User</p>
            <AccountRouter/>
          </Route>
          <Route path=''>
            <HomePage />
          </Route>
        </Switch>

      </Router>
    </div>
  )
}