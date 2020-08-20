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
      this.props.history.push('/');
    }).catch((error) => {
      console.log(error);
    });
  }

  renderAuthButtons() {
    const user = fbase.auth().currentUser;

    if (user) {
      return (
        <ul>
          <li><NavLink to="/"><button type="button" id="nav-signout" onClick={this.handleSignOut}>Sign Out</button></NavLink></li>
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
        <div>
          <NavLink to="/" id="nav-title"><h2><i className="fas fa-fire-alt" id="fire-icon" />TouchTheFire</h2></NavLink>
        </div>
        <div>
          {this.renderAuthButtons()}
        </div>
      </nav>
    );
  }
}

export default Nav;
