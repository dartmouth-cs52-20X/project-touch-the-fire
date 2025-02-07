/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import '../style.scss';
import {
  BrowserRouter as Router, Route, Switch,
} from 'react-router-dom';
import fbase from '../config/fire';
import Game from '../game';
import Nav from './nav';
import SignIn from './sign-in';
import SignUp from './sign-up';
import LandingPage from './landing-page';
import Leaderboard from './leaderboard';
import Instructions from './instructions';
import queueing_page from './queueing_page';
import PrivateRoute from './privateroute';

const FallBack = (props) => {
  return <div>URL Not Found</div>;
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
    };
  }

  componentDidMount() {
    this.handleAuthChange();
  }

  handleAuthChange() {
    fbase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      } else {
        this.setState({ user: null });
      }
    });
  }

  renderNav() {
    if (this.state.user) {
      return <Nav />;
    } else {
      return null;
    }
  }

  render() {
    return (
      <Router>
        <div id="main-top">
          {this.renderNav()}
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <PrivateRoute path="/game" component={Game} />
            <Route path="/signin" component={SignIn} />
            <Route path="/signup" component={SignUp} />
            <PrivateRoute path="/leaderboard" component={Leaderboard} />
            <PrivateRoute path="/queue" component={queueing_page} />
            <PrivateRoute path="/instructions" component={Instructions} />
            <Route component={FallBack} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
