/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-unused-vars */
/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import io from 'socket.io-client';
import $ from 'jquery';
import { setChatMessages, createChatMessage, clearChat } from '../actions';
import keystone from '../assets/keystone.png';

// For testing
// const socketserver = 'http://localhost:9090';
// For deploying
// const socketserver = 'https://touch-the-fire-api.herokuapp.com/';
const socketserver = 'https://touchthefirechat.herokuapp.com/';
class Chat extends Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      // clicked: 'Click to See Available Power Ups',
    };

    // Setting up the socket
    this.socket = io(socketserver);
    this.socket.on('connect', () => { console.log('socket.io connected'); });
    this.socket.on('disconnect', () => { console.log('socket.io disconnected'); });
    this.socket.on('reconnect', () => { console.log('socket.io reconnected'); });
    this.socket.on('error', (error) => { console.log(error); });
  }

  // Get the previous chat messages when you open the chat
  componentDidMount() {
    this.socket.on('chatMessages', (chatMessages) => {
      console.log('chats received');
      this.props.setChatMessages(chatMessages);
    });
  }

  // Event listener for submiting a new chat message
  // If in guest mode, set the username to 'Guest' --> probably want to store the generated guest ID from the landing page in the redux store and use that instead
  // Only want to send message if the it is not ''
  onSubmitClick = (event) => {
    if (this.state.message !== '') {
      this.props.createChatMessage(
        this.socket,
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
        this.socket,
        {
          username: this.props.current_user,
          message: this.state.message,
        },
      );
      // Re-set the local message state to '' after sending a message
      this.setState({ message: '' });
    }
  }

  // Temporary to empty the chat --> really would want to call a method from the end game screen to clear the chat before the next round
  onClearPress = (event) => {
    this.props.clearChat(this.socket);
  }

  // Event listener for changing the message input box
  onMessageChange = (event) => {
    this.setState({ message: event.target.value });
  }

  // onPowerUp(imgAttr) {
  //   this.setState({ clicked: imgAttr });
  // }

  // Want the input box to send message on enter
  // Also have a button that sends message on click
  renderMessageInputBox() {
    return (
      <div className="message-input-wrapper">
        <input type="text" placeholder="message" onChange={this.onMessageChange} onKeyPress={this.onEnterPress} value={this.state.message} />
        <i className="far fa-paper-plane" onClick={this.onSubmitClick} role="button" tabIndex={0} aria-label="submit" />
        <i className="fas fa-trash" onClick={this.onClearPress} role="button" tabIndex={0} aria-label="submit" />
      </div>
    );
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

  // renderPowerMenu() {
  //   return (
  //     <div className="power-up-menu">
  //       <div><h1>Power Up Menu</h1></div>
  //       <div><h3>{this.state.clicked}</h3></div>
  //       <div className="power-up-menu-desc" />
  //       <div className="power-up-items">
  //         <div className="powerup-row">
  //           <div className="powerup-item" onClick={() => this.onPowerUp($('#key1').attr('alt'))}>
  //             <img id="key1" src={keystone} alt="150 coins: Press 1 for Speed Boost" />
  //           </div>
  //           <div className="powerup-item" onClick={() => this.onPowerUp($('#key2').attr('alt'))}>
  //             <img id="key2" src={keystone} alt="250 coins: Press 2 for Bullet Range Boost" />
  //           </div>
  //           <div className="powerup-item" onClick={() => this.onPowerUp($('#key3').attr('alt'))}>
  //             <img id="key3" src={keystone} alt="200 coins: Press 3 for Bullet Power Boost" />
  //           </div>
  //           <div className="powerup-item" onClick={() => this.onPowerUp($('#key4').attr('alt'))}>
  //             <img id="key4" src={keystone} alt="100 coins: Press 4 for Bullet Speed Boost" />
  //           </div>
  //         </div>
  //         <div className="powerup-row">
  //           <div className="powerup-item" onClick={() => this.onPowerUp($('#key5').attr('alt'))}>
  //             <img id="key5" src={keystone} alt="125 coins: Press 5 for Health Boost" />
  //           </div>
  //           <div className="powerup-item" onClick={() => this.onPowerUp($('#key6').attr('alt'))}>
  //             <img id="key6" src={keystone} alt="175 coins: Press 6 for 2x Fire Point Boost" />
  //           </div>
  //           <div className="powerup-item" onClick={() => this.onPowerUp($('#key7').attr('alt'))}>
  //             <img id="key7" src={keystone} alt="150 coins: Press 7 for Bigger Camera Area" />
  //           </div>
  //           <div className="powerup-item" onClick={() => this.onPowerUp($('#key8').attr('alt'))}>
  //             <img id="key8" src={keystone} alt="100 coins: Press 8 for Turning Speed Boost" />
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  render() {
    return (
      <div className="chat-wrapper">
        {/* <div className="power-up-menu-container">
          {this.renderPowerMenu()}
        </div> */}
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

export default withRouter(connect(mapStateToProps, { setChatMessages, createChatMessage, clearChat })(Chat));
