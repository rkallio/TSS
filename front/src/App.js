import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Badge from "@material-ui/core/Badge";
import logo from "./logo.svg";
import "./App.css";
import SignIn from "./SignIn";
import Nav from "./Nav";
import Dayview from "./Dayview";
import Weekview from "./Weekview";
import Trackview from "./Trackview";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

class App extends Component {
  state = {};

  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <Nav />
            <Switch>
              <Route path="/" exact component={Weekview} />
              <Route path="/signin" component={SignIn} />
              <Route path="/:date" component={Dayview} />
              {//<Route path="/:date/:track" component={Trackview} /> 
              }
            </Switch>
          </header>
        </div>
      </Router>
    );
  }
}

export default App;
