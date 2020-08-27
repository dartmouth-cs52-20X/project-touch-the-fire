import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import socket from '../config/socket';

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
  }

  // If you leave the queue page, want to be removed from the queue
  componentWillUnmount() {
    socket.emit('remove me from the queue');
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

export default withRouter(QueueingPage);
