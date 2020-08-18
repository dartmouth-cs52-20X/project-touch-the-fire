import React, { Component } from 'react';
import '../style.scss';
import {
  BrowserRouter as Router, Route, NavLink, Switch,
} from 'react-router-dom';
import fbase from '../config/fire';
import Game from '../game';
import SignIn from './sign-in';

const About = (props) => {
  return <div> All there is to know about me </div>;
};
const Welcome = (props) => {
  return <div>Welcome</div>;
};

const Nav = (props) => {
  return (
    <nav>
      <ul>
        <li><NavLink to="/" exact>Home</NavLink></li>
        <li><NavLink to="/about">About</NavLink></li>
        <li><NavLink to="/game">Game</NavLink></li>
        <li><NavLink to="/signin">Sign In</NavLink></li>
        <li><NavLink to="/signup">Sign Up</NavLink></li>
      </ul>
    </nav>
  );
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

  render() {
    return (
      <Router>
        <div>
          <div>Test {this.state.user}</div>
          <Nav />
          <Switch>
            <Route exact path="/" component={Welcome} />
            <Route path="/about" component={About} />
            <Route path="/game" component={Game} />
            <Route path="/signin" component={SignIn} />
            <Route path="/signup" component={SignUp} />
            <Route component={FallBack} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
