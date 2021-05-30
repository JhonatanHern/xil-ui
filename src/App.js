import React from "react"
import { Switch, Router, Route, Redirect } from "react-router-dom"
import history from "./history"

// COMPONENTS
import Header from "./components/Header"
import Home from "./components/Home"
import Dashboard from "./components/Dashboard"

export default function App() {
  const routes = (
    <Switch>
      <Route path="/" exact>
        <Home />
      </Route>
      <Route path="/batch" exact>
        <Dashboard />
      </Route>
      <Redirect to="/" />
    </Switch>
  )

  return (
    <>
      <Router history={history}>
        <Header />
        <main>{routes}</main>
      </Router>
    </>
  )
}
