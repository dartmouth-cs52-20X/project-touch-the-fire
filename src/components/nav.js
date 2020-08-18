/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import fbase from '../config/fire';

class Nav extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handleSignOut() {
    fbase.auth().signOut().then(() => {
      console.log('sign out success');
    }).catch((error) => {
      console.log(error);
    });
  }

  renderAuthButtons() {
    const user = fbase.auth().currentUser;

    if (user) {
      return (
        <ul>
          <li><button type="button" onClick={this.handleSignOut}>Sign Out</button></li>
        </ul>
      );
    } else {
      return (
        <ul>
          <li><NavLink to="/signin">Sign In</NavLink></li>
          <li><NavLink to="/signup">Sign Up</NavLink></li>
        </ul>
      );
    }
  }

  render() {
    return (
      <nav>
        <ul>
          <li><NavLink to="/" exact>Home</NavLink></li>
          <li><NavLink to="/about">About</NavLink></li>
          <li><NavLink to="/game">Game</NavLink></li>
        </ul>
        {this.renderAuthButtons()}
      </nav>
    );
  }
}

export default Nav;
