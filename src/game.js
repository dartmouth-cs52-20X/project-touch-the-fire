/* eslint-disable react/state-in-constructor */
import React, { Component } from 'react';
import Phaser from 'phaser';
import { IonPhaser } from '@ion-phaser/react';
import GameScene from './scenes/gamescene';
import Chat from './components/chat';
import PowerUp from './components/powerup-menu';

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

export default Game;
