/* eslint-disable no-undef */
import { Scene } from 'phaser';
import io from 'socket.io-client';
import fbase from '../config/fire';
import spaceshipred from '../assets/spaceshipred.png';
import money from '../assets/money.png';
import logo from '../logo.png';

import green from '../assets/green.png';
import fire from '../assets/fire.png';

const MAP_VIEW_MULT = 2;

class GameScene extends Scene {
  constructor() {
    super({
      key: 'GameScene',
    });
  }

  preload() {
    this.load.image('ship', spaceshipred);
    this.load.image('money', money);
    this.load.image('logo', logo);
    this.load.image('green', green);
    this.load.image('fire', fire);
  }

  handleAuthChange = () => {
    fbase.auth().onAuthStateChanged((user) => {
      console.log(user.displayName);
      if (user) {
        return user;
      } else {
        return null;
      }
    });
  }

  /* Starting template was adapted from phaser intro tutorial at https://phasertutorials.com/creating-a-simple-multiplayer-game-in-phaser-3-with-an-authoritative-server-part-1/ */
  create() {
    this.socket = io('https://touch-the-fire-api.herokuapp.com/');
    // this.socket = io('http://localhost:9090');
    this.socket.on('connect', () => { console.log('socket.io connected'); });
    this.add.image(this.game.canvas.width, this.game.canvas.height, 'green').setDisplaySize(this.game.canvas.width * MAP_VIEW_MULT, this.game.canvas.height * MAP_VIEW_MULT);
    this.add.image(this.game.canvas.width, this.game.canvas.height + 60, 'fire').setDisplaySize(50, 65);
    this.otherPlayers = this.physics.add.group();
    const username = this.handleAuthChange();
    this.socket.emit('username', username);
    this.socket.on('currentPlayers', (players) => {
      console.log(players);
      Object.keys(players).forEach((id) => {
        if (players[id].playerId === this.socket.id) {
          console.log(players[id]);
          this.addPlayer(players[id]);
        } else {
          this.addOtherPlayers(players[id]);
        }
      });
    });
    this.socket.on('newPlayer', (playerInfo) => {
      this.addOtherPlayers(playerInfo);
    });
    this.socket.on('disconnect', (playerId) => {
      this.otherPlayers.getChildren().forEach((otherPlayer) => {
        if (playerId === otherPlayer.playerId) {
          otherPlayer.destroy();
        }
      });
    });

    // added wasd keys to movement
    this.cursors = { ...this.input.keyboard.createCursorKeys(), ...this.input.keyboard.addKeys('W,S,A,D') };
    console.log(this.cursors);

    this.socket.on('playerMoved', (playerInfo) => {
      this.otherPlayers.getChildren().forEach((otherPlayer) => {
        if (playerInfo.playerId === otherPlayer.playerId) {
          otherPlayer.setRotation(playerInfo.rotation);
          otherPlayer.setPosition(playerInfo.x, playerInfo.y);
        }
      });
    });
    this.blueScoreText = this.add.text(16, 16, '', { fontSize: '32px', fill: '#0000FF' }).setScrollFactor(0);
    this.redScoreText = this.add.text(584, 16, '', { fontSize: '32px', fill: '#008000' }).setScrollFactor(0);
    this.socket.on('scoreUpdate', (scores) => {
      this.blueScoreText.setText(`Blue: ${scores.blue}`);
      this.redScoreText.setText(`Green: ${scores.red}`);
    });
    this.socket.on('starLocation', (starLocation) => {
      if (this.star) this.star.destroy();
      this.star = this.physics.add.image(starLocation.x, starLocation.y, 'money').setDisplaySize(53, 40);
      this.physics.add.overlap(this.ship, this.star, () => {
        this.socket.emit('starCollected');
      });
    });
  }

  addOtherPlayers = (playerInfo) => {
    const otherPlayer = this.add.sprite(playerInfo.x, playerInfo.y, 'ship').setOrigin(0.5, 0.5).setDisplaySize(53, 40);
    if (playerInfo.team === 'blue') {
      otherPlayer.setTint(0x0000ff);
    } else {
      otherPlayer.setTint(0x008000);
    }
    otherPlayer.playerId = playerInfo.playerId;
    this.otherPlayers.add(otherPlayer);
  }

  addPlayer = (playerInfo) => {
    this.ship = this.physics.add.image(playerInfo.x, playerInfo.y, 'ship').setOrigin(0.5, 0.5).setDisplaySize(53, 40);
    if (playerInfo.team === 'blue') {
      this.ship.setTint(0x0000ff);
    } else {
      this.ship.setTint(0x008000);
    }
    this.ship.setDrag(100);
    this.ship.setAngularDrag(100);
    this.ship.setMaxVelocity(200);

    // movement translational
    this.cameras.main.startFollow(this.ship);
  }

  update() {
    if (this.ship) {
      if (this.cursors.left.isDown || this.cursors.A.isDown) {
        // this.ship.setAngularVelocity(-150);
        this.ship.setVelocityX(-200);
        this.ship.setRotation(Math.PI / 2);
        // this.cameras.main.shake();
      } else if (this.cursors.right.isDown || this.cursors.D.isDown) {
        // this.ship.setAngularVelocity(150);
        this.ship.setVelocityX(200);
        this.ship.setRotation(-Math.PI / 2);
      } else {
        this.ship.setAngularVelocity(0);
        this.ship.setVelocityX(0);
      }

      if (this.cursors.up.isDown || this.cursors.W.isDown) {
        // this.physics.velocityFromRotation(this.ship.rotation + 1.5, 100, this.ship.body.acceleration);
        this.ship.setVelocityY(-200);
        this.ship.setRotation(Math.PI);
      } else if (this.cursors.down.isDown || this.cursors.S.isDown) {
        this.ship.setVelocityY(200);
        this.ship.setRotation();
      } else {
        // this.ship.setAcceleration(0);
        this.ship.setVelocityY(0);
      }

      // this.physics.world.wrap(this.ship, 5);
      const { x } = this.ship;
      const { y } = this.ship;
      const r = this.ship.rotation;
      if (this.ship.oldPosition && (x !== this.ship.oldPosition.x || y !== this.ship.oldPosition.y || r !== this.ship.oldPosition.rotation)) {
        if ((x > this.game.canvas.width * MAP_VIEW_MULT || x < 0) && (y > this.game.canvas.height * MAP_VIEW_MULT || y < 0)) {
          this.socket.emit('playerMovement', { x: this.ship.oldPosition.x, y: this.ship.oldPosition.y, rotation: this.ship.rotation });
          // console.log('both');
          this.ship.x = this.ship.oldPosition.x;
          this.ship.y = this.ship.oldPosition.y;
          this.cameras.main.shake();
        } else if (x > this.game.canvas.width * MAP_VIEW_MULT || x < 0) {
          // console.log('x cross');
          // console.log(x);
          // console.log(this.game.canvas.width);
          this.socket.emit('playerMovement', { x: this.ship.oldPosition.x, y: this.ship.y, rotation: this.ship.rotation });
          this.ship.x = this.ship.oldPosition.x;
          this.cameras.main.shake();
        } else if (y > this.game.canvas.height * MAP_VIEW_MULT || y < 0) {
          // console.log('y cross');
          // console.log(y);
          // console.log(this.game.canvas.height);
          this.socket.emit('playerMovement', { x: this.ship.x, y: this.ship.oldPosition.y, rotation: this.ship.rotation });
          this.ship.y = this.ship.oldPosition.y;
          this.cameras.main.shake();
        } else {
          this.socket.emit('playerMovement', { x: this.ship.x, y: this.ship.y, rotation: this.ship.rotation });
          // console.log('neither cross');
        }
      }

      // save old position data
      this.ship.oldPosition = {
        x: this.ship.x,
        y: this.ship.y,
        rotation: this.ship.rotation,
      };
    }
  }
}

export default GameScene;
