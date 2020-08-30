/* eslint-disable camelcase */
/* eslint-disable react/state-in-constructor */
import React, { Component } from 'react';
import Phaser from 'phaser';
import { IonPhaser } from '@ion-phaser/react';
import { connect } from 'react-redux';
import { signIn } from './actions';
import GameScene from './scenes/gamescene';
import fbase from './config/fire';
import Chat from './components/chat';
import PowerUp from './components/powerup-menu';
import socket from './config/socket';

class Game extends Component {
  constructor(props) {
    super(props);

    this.state = {
      initialize: true,
      game: {
        type: Phaser.AUTO,
        width: '80%',
        height: '95%',
        physics: {
          default: 'arcade',
          arcade: {
            debug: false,
            gravity: { y: 0 },
          },
        },
        scene: [GameScene],
      },
    };

    socket.emit('add me to the game');
  }
  // state = {
  //   initialize: true,
  //   game: {
  //     type: Phaser.AUTO,
  //     width: '80%',
  //     height: '100%',
  //     physics: {
  //       default: 'arcade',
  //       arcade: {
  //         debug: false,
  //         gravity: { y: 0 },
  //       },
  //     },
  //     scene: [GameScene],
  //   },
  // };

  // Setting username in the Redux store if the user refreshes the page
  componentDidMount() {
    this.handleAuthChange();
  }

  // If you leave the game page, want to be removed from the game
  componentWillUnmount() {
    socket.emit('remove me from the game');
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
    const { initialize, game } = this.state;
    return (
      <div className="game-wrapper">
        <div>
          <IonPhaser game={game} initialize={initialize} />
          <div className="big-chat-wrapper">
            <PowerUp id="game-pmenu" />
            <Chat id="chat" />
          </div>
        </div>
      </div>

    );
  }
}

export default connect(null, { signIn })(Game);
