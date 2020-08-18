/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import fbase from '../config/fire';

class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSignInPress = this.handleSignInPress.bind(this);
  }

  handleEmailChange(event) { this.setState({ email: event.target.value }); }

  handlePasswordChange(event) { this.setState({ password: event.target.value }); }

  handleSignInPress(event) {
    event.preventDefault();

    fbase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((u) => {
      console.log(u);
    }).catch((err) => {
      console.log(err);
    });
  }

  handleGuestLogin(event) {
    event.preventDefault();
    fbase.auth().signInAnonymously().then((u) => { console.log(u); }).catch((err) => { console.log(err); });
  }

  render() {
    return (
      <div>
        <h1>Sign In</h1>
        <form>
          <input type="text" placeholder="email" onChange={this.handleEmailChange} />
          <input type="text" placeholder="password" onChange={this.handlePasswordChange} />
          <button type="button" onClick={this.handleSignInPress}>Sign In</button>
        </form>
        <p>New to Touch the Fire? Create an account <NavLink to="/signup">here!</NavLink></p>
        <button type="button" onClick={this.handleGuestLogin}>Play as Guest</button>
      </div>
    );
  }
}

export default SignIn;
