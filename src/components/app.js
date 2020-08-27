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
        <div>
          {this.renderNav()}
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route path="/game" component={Game} />
            <Route path="/signin" component={SignIn} />
            <Route path="/signup" component={SignUp} />
            <Route path="/leaderboard" component={Leaderboard} />
            <Route path="/instructions" component={Instructions} />
            <Route component={FallBack} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
