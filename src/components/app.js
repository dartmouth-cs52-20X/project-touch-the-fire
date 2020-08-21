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
import Chat from './chat';

const About = (props) => {
  return <div> All there is to know about me </div>;
};
const Welcome = (props) => {
  return <div>Welcome</div>;
};

const FallBack = (props) => {
  return <div>URL Not Found</div>;
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
    };

    this.handleAuthChange.bind(this);
    this.renderUserName.bind(this);
  }

  componentDidMount() {
    this.handleAuthChange();
  }

  handleAuthChange = () => {
    fbase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user });
      } else {
        this.setState({ user: null });
      }
    });
  }

  renderUserName() {
    if (this.state.user) {
      return (
        <div>{this.state.user.displayName}</div>
      );
    } else {
      return null;
    }
  }

  render() {
    return (
      <Router>
        <div>
          {this.renderUserName()}
          <Nav />
          <Switch>
            <Route exact path="/" component={Welcome} />
            <Route path="/about" component={About} />
            <Route path="/game" component={Game} />
            <Route path="/signin" component={SignIn} />
            <Route path="/signup" component={SignUp} />
            <Route path="/chat" component={Chat} />
            <Route component={FallBack} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
