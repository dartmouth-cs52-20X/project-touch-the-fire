import React, { Component } from 'react';
import { withRouter, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { signIn } from '../actions';
import socket from '../config/socket';
import fbase from '../config/fire';

class QueueingPage extends Component {
  // https://stackoverflow.com/questions/53949393/cant-perform-a-react-state-update-on-an-unmounted-component
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      current_game_size: 0,
    };

    socket.emit('add me to the waiting queue');
  }

  // Adding event listeners
  componentDidMount() {
    this._isMounted = true;
    socket.on('current game size', (length) => {
      if (this._isMounted) {
        this.setState({ current_game_size: length });
      }
    });
    // To set the username in the Redux store if the user refreshes the page
    this.handleAuthChange();
  }

  // If you leave the queue page, want to be removed from the queue
  componentWillUnmount() {
    this._isMounted = false;
    socket.emit('remove me from the queue');
  }

  handleAuthChange() {
    fbase.auth().onAuthStateChanged((user) => {
      if (user) {
        if (user.displayName) {
          this.props.signIn(user.displayName);
        } else {
          this.props.signIn(`Guest_${user.uid.substring(0, 4)}`);
        }
      }
    });
  }

  render() {
    // If the game is full
    if (this.state.current_game_size >= 6) {
      return (
        <div className="queue-page-wrapper">
          <h1>The current game is full. You will be able to join soon.</h1>
          <h2>{this.state.current_game_size}/6 players have joined the game.</h2>
        </div>
      );
    } else { // If the game is not yet at full capacity
      return (
        <div className="queue-page-wrapper">
          <h1>You can join the current game!</h1>
          <h2>{this.state.current_game_size}/6 players have joined the game.</h2>
          <NavLink to="/game"><button type="button" className="button-var2">Join Game</button></NavLink>
        </div>
      );
    }
  }
}

export default withRouter(connect(null, { signIn })(QueueingPage));
