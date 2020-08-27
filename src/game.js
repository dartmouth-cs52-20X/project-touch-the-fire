/* eslint-disable react/state-in-constructor */
import React, { Component } from 'react';
import Phaser from 'phaser';
import { IonPhaser } from '@ion-phaser/react';
import { connect } from 'react-redux';
import { signIn } from './actions';
import GameScene from './scenes/gamescene';
import fbase from './config/fire';
import Chat from './components/chat';

class Game extends Component {
  state = {
    initialize: true,
    game: {
      type: Phaser.AUTO,
      width: '80%',
      height: '100%',
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

  // Setting username in the Redux store if the user refreshes the page
  componentDidMount() {
    this.handleAuthChange();
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
          <Chat id="chat" />
        </div>
      </div>

    );
  }
}

export default connect(null, { signIn })(Game);
