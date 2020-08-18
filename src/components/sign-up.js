/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import fbase from '../config/fire';

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      username: '',
      password: '',
    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSignUpPress = this.handleSignUpPress.bind(this);
  }

  handleEmailChange(event) { this.setState({ email: event.target.value }); }

  handleUsernameChange(event) { this.setState({ username: event.target.value }); }

  handlePasswordChange(event) { this.setState({ password: event.target.value }); }

  handleSignUpPress(event) {
    event.preventDefault();

    fbase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((u) => {
      const user = fbase.auth().currentUser;

      user.updateProfile({ displayName: this.state.username }).then(() => { console.log('username added'); }).catch((err) => { console.log(err); });
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
        <h1>Sign Up</h1>
        <form>
          <input type="text" placeholder="email" onChange={this.handleEmailChange} />
          <input type="text" placeholder="username" onChange={this.handleUsernameChange} />
          <input type="text" placeholder="password" onChange={this.handlePasswordChange} />
          <button type="button" onClick={this.handleSignUpPress}>Sign Up</button>
        </form>
        <p>Already have an account? Sign in <NavLink to="/signin">here!</NavLink></p>
        <button type="button" onClick={this.handleGuestLogin}>Play as Guest</button>
      </div>
    );
  }
}

export default SignUp;
