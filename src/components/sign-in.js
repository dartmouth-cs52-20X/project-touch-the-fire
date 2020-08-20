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

    this.props.history.push('/');
  }

  render() {
    return (
      <div>
        <form className="landing-page-alt">
          <h1>Sign In</h1>
          <div><input type="text" placeholder="email" onChange={this.handleEmailChange} /></div>
          <div><input type="text" placeholder="password" onChange={this.handlePasswordChange} /></div>
          <NavLink to="/"><button type="button" onClick={this.handleSignInPress} className="button-var1">Sign In</button></NavLink>
          <p>New to Touch the Fire? Create an account <NavLink to="/signup" className="here-link">here!</NavLink></p>
        </form>
      </div>
    );
  }
}

export default SignIn;
