/* eslint-disable react/state-in-constructor */
import React, { Component } from 'react';
import Phaser from 'phaser';
import { IonPhaser } from '@ion-phaser/react';
import GameScene from './scenes/gamescene';

class Game extends Component {
  state = {
    initialize: true,
    game: {
      type: Phaser.AUTO,
      parent: 'phaser-parent',
      width: '100%',
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
        <IonPhaser game={game} initialize={initialize} />
      </div>

    );
  }
}

export default Game;
