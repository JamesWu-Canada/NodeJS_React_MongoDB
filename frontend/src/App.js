import { BrowserRouter, Route, Switch } from "react-router-dom";
import React, { Component } from "react";
import NewOrder from "./NewOrder";
import OrderDisplay from "./OrderDisplay";
import Login from "./Login";
import PageNotFound from "./PageNotFound";
import Home from "./Home";
import Contact from "./Contact";

export default function App() {
  const [logged_in, set_logged_in] = React.useState(false);
  const [logged_in_email, set_logged_in_email] = React.useState("");
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [token, setToken] = React.useState("");

  console.log(`it is App() login = ${logged_in}`);
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/contact" component={Contact} />
        <Route
          exact
          path="/neworder"
          render={() => <NewOrder token={token} />}
        />
        <Route
          path="/display"
          render={() => (
            <OrderDisplay
              logged_in={logged_in}
              set_logged_in={set_logged_in}
              logged_in_email={logged_in_email}
              set_logged_in_email={set_logged_in_email}
              isAdmin={isAdmin}
              setIsAdmin={setIsAdmin}
              token={token}
            />
          )}
        />
        <Route
          path="/login"
          render={() => (
            <Login
              logged_in={logged_in}
              set_logged_in={set_logged_in}
              logged_in_email={logged_in_email}
              set_logged_in_email={set_logged_in_email}
              setIsAdmin={setIsAdmin}
              setToken={setToken}
            />
          )}
        />
        <Route component={PageNotFound} />
      </Switch>
    </BrowserRouter>
  );
}
