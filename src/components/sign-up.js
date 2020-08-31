/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import fbase from '../config/fire';
import { signIn } from '../actions';

class SignUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      username: '',
      password: '',
    };
  }

  handleEmailChange = (event) => { this.setState({ email: event.target.value }); }

  handleUsernameChange = (event) => { this.setState({ username: event.target.value }); }

  handlePasswordChange = (event) => { this.setState({ password: event.target.value }); }

  handleSignUpPress = (event) => {
    event.preventDefault();

    if (this.state.username) {
      fbase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).then((u) => {
        const user = fbase.auth().currentUser;

        user.updateProfile({ displayName: this.state.username }).then(() => {
          console.log('username added');
          // Add the newly signed-in user's username to the Redux store
          this.props.signIn(this.state.username);
        }).catch((err) => { console.log(err); });
        console.log(u);

        document.getElementById('sign-up-failed').classList.add('hidden');
        document.getElementById('sign-up-failed').classList.remove('sign-in-up-fail');
        this.props.history.push('/');
      }).catch((err) => {
        console.log(err);
        document.getElementById('sign-up-failed').classList.remove('hidden');
        document.getElementById('sign-up-failed').classList.add('sign-in-up-fail');
      });
    } else {
      document.getElementById('sign-up-failed').classList.remove('hidden');
      document.getElementById('sign-up-failed').classList.add('sign-in-up-fail');
    }
  }

  handleGuestLogin = (event) => {
    event.preventDefault();
    fbase.auth().signInAnonymously().then((u) => {
      console.log(u);
      // Store the guest username in the Redux store (taken from the one generated in the landing page)
      this.props.signIn(`Guest_${u.user.uid.substring(0, 4)}`);
    }).catch((err) => { console.log(err); });
  }

  render() {
    return (
      <div>
        <form className="landing-page-alt">
          <h1>Sign Up</h1>
          <div><input type="text" placeholder="email" onChange={this.handleEmailChange} /></div>
          <div><input type="text" placeholder="username" onChange={this.handleUsernameChange} /></div>
          <div><input type="text" placeholder="password" onChange={this.handlePasswordChange} /></div>
          <NavLink to="/"><button type="button" onClick={this.handleSignUpPress} className="button-var1">Sign Up</button></NavLink>
          <p>Already have an account? Sign in <NavLink to="/signin" className="here-link">here!</NavLink></p>
          <div id="sign-up-failed" className="hidden">
            <h2>Sign Up Failed</h2>
            <h4>Ensure your email is valid</h4>
            <h4>Ensure you chose a username</h4>
            <h4>Ensure your password is 6+ characters</h4>
          </div>
        </form>
      </div>
    );
  }
}

export default withRouter(connect(null, { signIn })(SignUp));
