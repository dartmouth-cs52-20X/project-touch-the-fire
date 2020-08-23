/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import fbase from '../config/fire';

class LandingPage extends Component {
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

  handleGuestLogin(event) {
    event.preventDefault();
    fbase.auth().signInAnonymously().then((u) => { console.log(u); }).catch((err) => { console.log(err); });
  }

  renderWelcomeMessage() {
    if (fbase.auth().currentUser) {
      if (fbase.auth().currentUser.displayName) {
        return (
          <h1>Welcome, {fbase.auth().currentUser.displayName}!</h1>
        );
      } else {
        const guestID = fbase.auth().currentUser.uid.substring(0, 4);
        return (
          <h1>Welcome, Guest {guestID}!</h1>
        );
      }
    } else {
      return null;
    }
  }

  render() {
    if (this.state.user) {
      return (
        <div className="landing-page">
          <div>
            {this.renderWelcomeMessage()}
          </div>
          <div>
            <NavLink to="/game"><button type="button">Play</button></NavLink>
          </div>
          <div>
            <NavLink to="/leaderboard"><button type="button">Leaderboard</button></NavLink>
          </div>
        </div>
      );
    } else {
      return (
        <div className="landing-page-alt">
          <h1>TouchTheFire</h1>
          <div>
            <NavLink to="/signin"><button type="button" className="button-var1">Sign In</button></NavLink>
          </div>
          <div>
            <NavLink to="/signup"><button type="button" className="button-var1">Sign Up</button></NavLink>
          </div>
          <div>
            <button type="button" onClick={this.handleGuestLogin} className="button-var1">Play as Guest</button>
          </div>
        </div>
      );
    }
  }
}

export default LandingPage;
