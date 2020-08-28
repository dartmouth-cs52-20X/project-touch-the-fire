/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import fbase from '../config/fire';
import { signIn } from '../actions';

class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
    };
  }

  handleEmailChange = (event) => { this.setState({ email: event.target.value }); }

  handlePasswordChange = (event) => { this.setState({ password: event.target.value }); }

  handleSignInPress = (event) => {
    event.preventDefault();

    fbase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).then((u) => {
      console.log(u);
      // Store the newly signed-in user's username in the Redux store
      this.props.signIn(u.user.displayName);
      document.getElementById('sign-in-failed').classList.add('hidden');
      document.getElementById('sign-in-failed').classList.remove('sign-in-up-fail');
      this.props.history.push('/');
    }).catch((err) => {
      console.log(err);
      document.getElementById('sign-in-failed').classList.remove('hidden');
      document.getElementById('sign-in-failed').classList.add('sign-in-up-fail');
    });
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
          <div id="sign-in-failed" className="hidden">
            <h2>Sign In Failed</h2>
            <h4>Please check your email and password</h4>
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(connect(null, { signIn })(SignIn));
