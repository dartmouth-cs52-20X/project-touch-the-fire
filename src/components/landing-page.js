/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import fbase from '../config/fire';
import { signIn } from '../actions';

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

  handleGuestLogin = (event) => {
    event.preventDefault();
    fbase.auth().signInAnonymously().then((u) => {
      console.log(u);
      // Store the guest username in the Redux store (taken from the one generated in the landing page)
      this.props.signIn(`Guest${u.user.uid.substring(0, 4)}`);
    }).catch((err) => {
      console.log(err);
    });
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

  renderWelcomeMessage() {
    // if (fbase.auth().currentUser) {
    //   if (fbase.auth().currentUser.displayName) {
    //     return (
    //       <h1>Welcome, {fbase.auth().currentUser.displayName}!</h1>
    //     );
    //   } else {
    //     const guestID = fbase.auth().currentUser.uid.substring(0, 4);
    //     return (
    //       <h1>Welcome, Guest {guestID}!</h1>
    //     );
    //   }
    // } else {
    //   return null;
    // }
    return (
      <h1>Welcome, {this.props.current_user}!</h1>
    );
  }

  render() {
    if (this.state.user) {
      return (
        <div className="landing-page">
          <div>
            {this.renderWelcomeMessage()}
          </div>
          <div>
            <NavLink to="/game"><button type="button" className="button-var2">Play</button></NavLink>
          </div>
          <div>
            <NavLink to="/chat"><button type="button" className="button-var2">Chat</button></NavLink>
          </div>
          <div>
            <NavLink to="/leaderboard"><button type="button" className="button-var2">Leaderboard</button></NavLink>
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

// Now have access to the signed-in user's username (or the guest username) with this.props.current_user
const mapStateToProps = (ReduxState) => (
  {
    current_user: ReduxState.username.current_user,
  }
);

export default withRouter(connect(mapStateToProps, { signIn })(LandingPage));
