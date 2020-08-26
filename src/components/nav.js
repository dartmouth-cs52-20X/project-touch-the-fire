/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { signOut } from '../actions';
import fbase from '../config/fire';

class Nav extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  handleSignOut = () => {
    fbase.auth().signOut().then(() => {
      console.log('sign out success');
      // Re-set the current-user in the Redux store
      this.props.signOut();
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    return (
      <nav>
        <div>
          <NavLink to="/" id="nav-title"><h2><i className="fas fa-fire-alt" id="fire-icon" />TouchTheFire</h2></NavLink>
        </div>
        <div>
          <ul>
            <li><NavLink to="/"><button type="button" id="nav-signout" onClick={this.handleSignOut}>Sign Out</button></NavLink></li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default withRouter(connect(null, { signOut })(Nav));
