/* eslint-disable no-undef */
import { Scene } from 'phaser';
import io from 'socket.io-client';
import fbase from '../config/fire';
import spaceshipred from '../assets/spaceshipred.png';
import money from '../assets/money.png';
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
    this.load.image('green', green);
    this.load.image('fire', fire);
  }

  /* Starting template was adapted from phaser intro tutorial at https://phasertutorials.com/creating-a-simple-multiplayer-game-in-phaser-3-with-an-authoritative-server-part-1/ */
  create() {
    // this.socket = io('https://touch-the-fire-api.herokuapp.com/');
    this.socket = io('localhost:9090');
    this.socket.on('connect', () => { console.log('socket.io connected'); });
    // eslint-disable-next-line max-len
    this.add.image(this.game.canvas.width * (MAP_VIEW_MULT / 2), this.game.canvas.height * (MAP_VIEW_MULT / 2), 'green').setDisplaySize(this.game.canvas.width * MAP_VIEW_MULT, this.game.canvas.height * MAP_VIEW_MULT);
    this.cameras.main.setBackgroundColor('#086100');
    this.fire = this.physics.add.image(this.game.canvas.width * (MAP_VIEW_MULT / 2), this.game.canvas.height * (MAP_VIEW_MULT / 2) + 60, 'fire').setDisplaySize(50 * 1.8, 65 * 1.8);

    this.otherPlayers = this.physics.add.group();
    fbase.auth().onAuthStateChanged((user) => {
      let username = user.displayName;
      if (username === null) { username = 'decheftw'; }
      console.log(username);
      this.socket.emit('username', username);
    });
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
    this.cursors = { ...this.input.keyboard.addKeys('W,S,A,D') };

    this.socket.on('playerMoved', (playerInfo) => {
      this.otherPlayers.getChildren().forEach((otherPlayer) => {
        if (playerInfo.playerId === otherPlayer.playerId) {
          otherPlayer.setRotation(playerInfo.rotation);
          otherPlayer.setPosition(playerInfo.x, playerInfo.y);
        }
      });
    });
    this.blueScoreText = this.add.text(16, 16, '', { fontSize: '32px', fill: '#0000FF' }).setScrollFactor(0);
    this.redScoreText = this.add.text(584, 16, '', { fontSize: '32px', fill: '#FF0000' }).setScrollFactor(0);
    this.socket.on('scoreUpdate', (scores) => {
      this.blueScoreText.setText(`Blue: ${scores.blue}`);
      this.redScoreText.setText(`Red: ${scores.red}`);
    });

    this.socket.on('starLocation', (starLocation) => {
      if (this.star) this.star.destroy();
      this.star = this.physics.add.image(starLocation.x, starLocation.y, 'money').setDisplaySize(53, 40);
      this.physics.add.overlap(this.ship, this.star, () => {
        this.socket.emit('starCollected');
      });
    });

    this.input.on('gameout', () => {
      console.log('out');
      this.game.input.keyboard.enabled = false;
    });

    this.input.on('gameover', () => {
      console.log('in');
      this.game.input.keyboard.enabled = true;
    });
    this.okoverlap = 0;
    this.switchstate = 0;
    this.fireDuration = [];
    this.game.input.keyboard.clearCaptures();
  }

  addOtherPlayers = (playerInfo) => {
    const otherPlayer = this.add.sprite(playerInfo.x, playerInfo.y, 'ship').setOrigin(0.5, 0.5).setDisplaySize(53, 40);
    if (playerInfo.team === 'blue') {
      otherPlayer.setTint(0x0000ff);
    } else {
      otherPlayer.setTint(0xFF0000);
    }
    otherPlayer.playerId = playerInfo.playerId;
    this.otherPlayers.add(otherPlayer);
  }

  addPlayer = (playerInfo) => {
    this.ship = this.physics.add.image(playerInfo.x, playerInfo.y, 'ship').setOrigin(0.5, 0.5).setDisplaySize(53, 40);

    if (playerInfo.team === 'blue') {
      this.ship.setTint(0x0000ff);
    } else {
      this.ship.setTint(0xFF0000);
    }
    this.ship.setDrag(100);
    this.ship.setAngularDrag(100);
    this.ship.setMaxVelocity(200);

    // movement translational
    this.cameras.main.startFollow(this.ship);
  }

  // found help from below link for knowing when two items are overlapping (ie touching the fire):
  // https://phaser.io/sandbox/edit/ikJBIznv
  handleCollide = () => {
    if (this.okoverlap !== 1) {
      this.okoverlap = 1;
      if (this.switchstate === 0) {
        this.switchstate = 1;
      } else {
        this.switchstate = 0;
      }
    }
    // logs the times / durations that you touched the fire, will update this to calculate the length of time
    // can do calc at the end of the match too maybe?
    const d = new Date();
    console.log(`touching fire at ${d.toLocaleTimeString()}.${(`000${d.getMilliseconds()}`).substr(-3)}`);
    this.fireDuration.push(d);
  }

  checkOverlap = (spriteA, spriteB) => {
    // eslint-disable-next-line new-cap
    return Phaser.Geom.Intersects.GetRectangleIntersection(spriteA.getBounds(), spriteB.getBounds());
  }

  update() {
    if (this.ship) {
      if (this.okoverlap === 1 && !this.checkOverlap(this.ship, this.fire)) {
        this.okoverlap = 0;
      }

      this.physics.overlap(this.ship, this.fire, this.handleCollide, null, this);

      if (this.cursors.left.isDown || this.cursors.A.isDown) {
        // this.ship.setAngularVelocity(-150);
        this.ship.setVelocityX(-200);
        console.log('beingcalled');
        this.ship.setRotation(Math.PI / 2);
        // this.cameras.main.shake();
      } else if (this.cursors.D.isDown) {
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
      } else if (this.cursors.S.isDown) {
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
        // dba: this.ship.dba,
      };
    }
  }
}

export default GameScene;
