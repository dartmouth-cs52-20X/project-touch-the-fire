/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
// import io from 'socket.io-client';
import $ from 'jquery';
import {
  setChatMessages, createChatMessage,
} from '../actions';
import socket from '../config/socket';
import keystone from '../assets/keystone.png';
import backgroundmusic from '../assets/backgroundmusic.mp3';

class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      music: true,
    };
    // this.sound = new Audio(soundfile);
    socket.emit('getInitialChats');
  }

  // Get the previous chat messages when you open the chat
  componentDidMount() {
    socket.on('chatMessages', (chatMessages) => {
      console.log('chats received');
      this.props.setChatMessages(chatMessages);
    });
  }

  // Event listener for submiting a new chat message
  // Only want to send message if the it is not ''
  onSubmitClick = (event) => {
    if (this.state.message !== '') {
      this.props.createChatMessage(
        socket,
        {
          username: this.props.current_user,
          message: this.state.message,
        },
      );
      // Re-set the local message state to '' after sending a message
      this.setState({ message: '' });
    }
  }

  // Only send the message if enter is clicked
  onEnterPress = (event) => {
    if (event.key === 'Enter' && this.state.message !== '') {
      this.props.createChatMessage(
        socket,
        {
          username: this.props.current_user,
          message: this.state.message,
        },
      );
      // Re-set the local message state to '' after sending a message
      this.setState({ message: '' });
      event.target.blur();
    }
  }

  // Event listener for changing the message input box
  onMessageChange = (event) => {
    this.setState({ message: event.target.value });
  }

  onMusic = (event) => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    this.setState({ music: !this.state.music });
  }

  // Want the input box to send message on enter
  // Also have a button that sends message on click
  renderMessageInputBox() {
    if (this.state.music) {
      return (
        <div className="message-input-wrapper">
          <input type="text" placeholder="message" onChange={this.onMessageChange} onKeyPress={this.onEnterPress} value={this.state.message} />
          <i className="far fa-paper-plane" onClick={this.onSubmitClick} role="button" tabIndex={0} aria-label="submit" />
          <i className="fas fa-trash" onClick={this.onClearPress} role="button" tabIndex={0} aria-label="submit" />
          <div id="music-toggle-off">
            <i className="fas fa-volume-mute" onClick={this.onMusic} role="button" tabIndex={0} aria-label="submit" />
          </div>

          {/* <embed src={soundfile} autostart="true" loop="true" /> */}
        </div>
      );
    } else {
      return (
        <div className="message-input-wrapper">
          <input type="text" placeholder="message" onChange={this.onMessageChange} onKeyPress={this.onEnterPress} value={this.state.message} />
          <i className="far fa-paper-plane" onClick={this.onSubmitClick} role="button" tabIndex={0} aria-label="submit" />
          <i className="fas fa-trash" onClick={this.onClearPress} role="button" tabIndex={0} aria-label="submit" />
          <div id="music-toggle-on">
            <i className="fas fa-volume-up" onClick={this.onMusic} role="button" tabIndex={0} aria-label="submit" />
          </div>
          <audio src={backgroundmusic} autoPlay infinite />
        </div>
      );
    }
  }

  // Want to display all the previous chat messages
  renderPreviousMessages() {
    if (this.props.chatMessages) {
      return (
        <div className="messages-wrapper">
          <div className="scroller">
            {this.props.chatMessages.map((chatMessage) => {
              return (
                <div className="message-wrapper" key={chatMessage.id}>
                  <p className="message-username">{chatMessage.username}</p>
                  <p className="message-text">{chatMessage.message}</p>
                </div>
              );
            })}
          </div>
        </div>
      );
    } else {
      return (
        <div>Loading messages...</div>
      );
    }
  }

  render() {
    return (
      <div className="chat-wrapper">
        {this.renderPreviousMessages()}
        {this.renderMessageInputBox()}

      </div>
    );
  }
}

// Want to have access to all chat messages through props
const mapStateToProps = (ReduxState) => (
  {
    chatMessages: ReduxState.chatMessages.all,
    current_user: ReduxState.username.current_user,
  }
);

export default withRouter(connect(mapStateToProps, { setChatMessages, createChatMessage })(Chat));
