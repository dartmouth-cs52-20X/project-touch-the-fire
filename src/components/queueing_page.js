import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { signIn } from '../actions';
import socket from '../config/socket';
import fbase from '../config/fire';

class QueueingPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      current_queue_length: 0,
    };

    socket.emit('add me to the queue');
  }

  // Adding event listeners
  componentDidMount() {
    socket.on('current queue length', (length) => {
      this.setState({ current_queue_length: length });
    });
    socket.on('go to the game', () => {
      this.props.history.push('/game');
    });
    window.addEventListener('unload', (event) => {
      socket.emit('remove me from the queue');
    });
    // To set the username in the Redux store if the user refreshes the page
    this.handleAuthChange();
  }

  // If you leave the queue page, want to be removed from the queue
  componentWillUnmount() {
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
    return (
      <div className="queue-page-wrapper">
        <h1>Waiting for more players...</h1>
        <h2>{this.state.current_queue_length}/6 players have joined</h2>
      </div>
    );
  }
}

export default withRouter(connect(null, { signIn })(QueueingPage));
