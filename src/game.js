/* eslint-disable react/state-in-constructor */
import React, { Component } from 'react';
import Phaser from 'phaser';
import { IonPhaser } from '@ion-phaser/react';
import GameScene from './scenes/gamescene';
import Chat from './components/chat';

class Game extends Component {
  state = {
    initialize: true,
    game: {
      type: Phaser.AUTO,
      width: '80%',
      height: '95vh',
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

export default Game;
