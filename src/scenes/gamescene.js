/* eslint-disable max-len */
/* eslint-disable no-undef */
import { Scene } from 'phaser';
import io from 'socket.io-client';
import fbase from '../config/fire';
import money from '../assets/money.png';
import blueplayer from '../assets/blue_above3.png';
import redplayer from '../assets/red_above.png';
import green from '../assets/green.png';
import fire from '../assets/fire.png';
import keystone from '../assets/keystone.png';
import shootNoise from '../assets/shoot.mp3';

const MAP_VIEW_MULT = 2;
class GameScene extends Scene {
  constructor() {
    super({
      key: 'GameScene',
    });
  }

  preload() {
  //  this.load.spritesheet('blueplayer', '../assets/blue_spritesheet.png', 662, 389);
    this.load.image('blueplayer', blueplayer);
    this.load.image('redplayer', redplayer);
    this.load.image('money', money);
    this.load.image('fire', fire);
    this.load.image('green', green);
    this.load.image('keystone', keystone);
    this.load.audio('pewpew', shootNoise);
  }

  /* Starting template was adapted from phaser intro tutorial at https://phasertutorials.com/creating-a-simple-multiplayer-game-in-phaser-3-with-an-authoritative-server-part-1/ */
  create() {
    // this.socket = io('https://touch-the-fire-api.herokuapp.com/');
    this.socket = io('localhost:9090');
    console.log(this.socket);
    this.socket.on('connect', () => { console.log('socket.io connected'); });
    // eslint-disable-next-line max-len
    this.add.image(this.game.canvas.width * (MAP_VIEW_MULT / 2), this.game.canvas.height * (MAP_VIEW_MULT / 2), 'green').setDisplaySize(this.game.canvas.width * MAP_VIEW_MULT, this.game.canvas.height * MAP_VIEW_MULT);
    this.cameras.main.setBackgroundColor('#086100');
    this.fire = this.physics.add.image(this.game.canvas.width * (MAP_VIEW_MULT / 2), this.game.canvas.height * (MAP_VIEW_MULT / 2) + 20, 'fire').setDisplaySize(50 * 1.8, 65 * 1.8);

    this.shootingNoise = this.sound.add('pewpew');
    // const musicConfig = {
    //   mute: false,
    //   volume: 1,
    // };

    // this.music.play(musicConfig);

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
    this.cursors = { ...this.input.keyboard.addKeys('W,S,A,D,SPACE,I,J,K,L') };

    this.socket.on('playerMoved', (playerInfo) => {
      this.otherPlayers.getChildren().forEach((otherPlayer) => {
        if (playerInfo.playerId === otherPlayer.playerId) {
          otherPlayer.setRotation(playerInfo.rotation);
          otherPlayer.setPosition(playerInfo.x, playerInfo.y);
        }
      });
    });
    this.blueScoreText = this.add.text(16, 16, '', { fontSize: '32px', fill: '#0000FF' }).setScrollFactor(0);
    this.countDownText = this.add.text(this.game.canvas.width * 0.5, 16, '', { fontSize: '32px', fill: '#FFFF00', fontFamily: 'Orbitron' }).setScrollFactor(0);
    this.redScoreText = this.add.text(this.game.canvas.width * 0.8, 16, '', { fontSize: '32px', fill: '#FF0000' }).setScrollFactor(0);

    this.socket.on('scoreUpdate', (scores) => {
      this.blueScoreText.setText(`Blue: ${scores.blue}`);
      this.redScoreText.setText(`Red: ${scores.red}`);
    });

    this.socket.on('starLocation', (starLocation) => {
      if (this.star) this.star.destroy();
      this.star = this.physics.add.image(starLocation.x, starLocation.y, 'money').setDisplaySize(53, 40);
      this.physics.add.overlap(this.ship, this.star, () => {
        console.log('pew');
        this.socket.emit('starCollected');
      });
    });

    this.socket.on('keystoneLocation', (keystoneLocation) => {
      if (this.keystone) this.keystone.destroy();
      this.keystone = this.physics.add.image(keystoneLocation.x, keystoneLocation.y, 'keystone').setDisplaySize(53, 40);
      this.physics.add.overlap(this.ship, this.keystone, () => {
        this.socket.emit('keystoneCollected');
      });
    });

    this.okoverlap = 0;
    this.switchstate = 0;
    this.fireDuration = [];
    this.firescorethreshold = 0;
    this.game.input.keyboard.clearCaptures();
    this.fired = false;
    this.input.keyboard.on('keydown_SPACE', () => {
      if (!this.fired && this.input.isOver) {
        this.fired = !this.fired;
        this.shootingNoise.play();
        this.socket.emit('lasershot', {
          laserId: Date.now(), initial_x: this.ship.x, initial_y: this.ship.y, x: this.ship.x, y: this.ship.y, rotation: this.ship.rotation, laser_speed: 15, shotfrom: this.socket.id, shooter_team: this.ship.team,
        });
      }
    });
    this.input.keyboard.on('keyup_SPACE', () => {
      this.fired = !this.fired;
    });
    this.socket.on('tick', (time) => {
      try {
        this.countDownText.setText(`${Math.floor(time / 60)}:${Math.floor(time % 60)}`);
      } catch {
        console.log('errorcatchactivated');
        this.socket.emit('forcedisconnect');
      }
    });

    this.lasers = [];
    this.socket.on('laser-locationchange', (updatedLasers) => {
      updatedLasers.forEach((item, index) => {
        if (this.lasers[index] === undefined) {
          this.lasers[index] = this.add.sprite(item.x, item.y, 'money').setDisplaySize(20, 10);
        } else {
          this.lasers[index].x = item.x;
          this.lasers[index].y = item.y;
        }
      });
      this.lasers.forEach((item, index) => {
        if (index >= updatedLasers.length) {
          item.destroy();
          this.lasers.splice(index, 1);
        }
      });
    });
    this.gameendtext = this.add.text((this.game.canvas.width / 2) - 100, this.game.canvas.height / 2, '', { fontSize: '60px', fill: '#FFFF00' }).setScrollFactor(0);

    this.socket.on('gameover', (data) => {
      this.gameendtext.setText(`${data.text}`);
    });

    this.restartin = this.add.text((this.game.canvas.width / 2) - 100, (this.game.canvas.height / 2) - 40, '', { fontSize: '55px', fill: '#FFFF00', fontFamily: 'Orbitron' }).setScrollFactor(0);

    this.socket.on('restarttick', (time) => {
      try {
        this.restartin.setText(`New Game Starts In ${time}`);
      } catch {
        console.log('errorcatchactivated');
        this.socket.emit('forcedisconnect');
      }
    });

    this.socket.on('restart', (payload) => {
      this.gameendtext.setText('');
      this.restartin.setText('');
      this.ship.x = 50;
      this.ship.y = 50;
      this.hitstaken = 0;
      this.socket.emit('playerMovement', { x: this.ship.x, y: this.ship.y, rotation: this.ship.rotation });
    });

    this.hitstaken = 0;
    this.lastlasertohit = Date.now();
    this.awayUpdate();
    this.socket.on('hit', (info) => {
      if (info.playerId === this.socket.id) {
        if (this.lastlasertohit !== info.laserId && info.shooter_team !== this.ship.team) {
          this.hitstaken += 1;
          this.lastlasertohit = info.laserId;
          this.ship.setAlpha(0.3);
        }
        console.log(this.hitstaken);
      } else {
        this.otherPlayers.getChildren().forEach((player) => {
          if (player.playerId === info.playerId && player.team !== this.ship.team) {
            player.setAlpha(0.3);
          }
        });
      }
    });
  }

  addOtherPlayers = (playerInfo) => {
    console.log(playerInfo);
    let otherPlayer;
    if (playerInfo.team === 'blue') {
      otherPlayer = this.add.sprite(playerInfo.x, playerInfo.y, 'blueplayer').setOrigin(0.5, 0.5).setDisplaySize(65, 40);
    } else {
      otherPlayer = this.add.sprite(playerInfo.x, playerInfo.y, 'redplayer').setOrigin(0.5, 0.5).setDisplaySize(65, 40);
    }

    otherPlayer.playerId = playerInfo.playerId;
    otherPlayer.team = playerInfo.team;
    this.otherPlayers.add(otherPlayer);
  }

  addPlayer = (playerInfo) => {
    // eslint-disable-next-line no-unused-expressions
    this.ship;
    if (playerInfo.team === 'blue') {
      this.ship = this.physics.add.image(playerInfo.x, playerInfo.y, 'blueplayer').setOrigin(0.5, 0.5).setDisplaySize(65, 40);
      // this.ship = this.physics.add.image(playerInfo.x, playerInfo.y, 'blueplayer').setOrigin(0.5, 0.5).setDisplaySize(65, 40);
      // this.anims.create({
      //   key: 'move',
      //   frames: this.anims.generateFrameNumbers('blueplayer', { start: 0, end: 4 }),
      //   frameRate: 5,
      //   repeat: -1,
      // });
    } else {
      this.ship = this.physics.add.image(playerInfo.x, playerInfo.y, 'redplayer').setOrigin(0.5, 0.5).setDisplaySize(65, 40);
    }

    this.ship.team = playerInfo.team;
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
    const d = new Date();
    this.fireDuration.push(d);
    if (this.fireDuration.length >= this.firescorethreshold + 100) {
      this.firescorethreshold = this.fireDuration.length;
      this.socket.emit('calcFireTime', { weight: 1 });
    }
  }

  checkOverlap = (spriteA, spriteB) => {
    // eslint-disable-next-line new-cap
    return Phaser.Geom.Intersects.GetRectangleIntersection(spriteA.getBounds(), spriteB.getBounds());
  }

  updateHitsOnAway = () => {
    if (this.hitstaken >= 3) {
      this.ship.x = 50;
      this.ship.y = 50;
      this.hitstaken = 0;
      this.socket.emit('playerMovement', { x: this.ship.x, y: this.ship.y, rotation: this.ship.rotation });
    }
  }

  awayUpdate= () => {
    setInterval(this.updateHitsOnAway, 1000);
  }

  update() {
    if (!this.game.isRunning) {
      this.socket.emit('disconnect', () => { console.log('game ended'); });
      console.log('disconnect');
    }
    if (this.ship) {
      if (this.hitstaken >= 3) {
        this.ship.x = 50;
        this.ship.y = 50;
        this.hitstaken = 0;
        this.socket.emit('playerMovement', { x: this.ship.x, y: this.ship.y, rotation: this.ship.rotation });
      }
      if (this.ship.alpha < 1) {
        this.ship.alpha += 0.01;
      } else {
        this.ship.setAlpha(1);
      }
      this.otherPlayers.getChildren().forEach((player) => {
        if (player.alpha < 1) {
          player.setAlpha(player.alpha + 0.01);
        } else {
          player.setAlpha(1);
        }
      });
      if (this.cursors.J.isDown && this.input.isOver) {
        this.ship.setAngularVelocity(-150);
      } else if (this.cursors.L.isDown && this.input.isOver) {
        this.ship.setAngularVelocity(150);
      } else {
        this.ship.setAngularVelocity(0);
      }

      if (this.cursors.I.isDown && this.input.isOver) {
        this.physics.velocityFromRotation(this.ship.rotation + 1.5, 200, this.ship.body.velocity);
      } else if (this.cursors.K.isDown && this.input.isOver) {
        this.physics.velocityFromRotation(this.ship.rotation - 1.5, 200, this.ship.body.velocity);
      } else {
        this.ship.setAcceleration(0);
        this.ship.setVelocity(0, 0);
      }
      if (this.okoverlap === 1 && !this.checkOverlap(this.ship, this.fire)) {
        this.okoverlap = 0;
      }

      this.physics.overlap(this.ship, this.fire, this.handleCollide, null, this);

      if (this.cursors.A.isDown && this.input.isOver) {
        // this.ship.setAngularVelocity(-150);
        this.ship.setVelocityX(-200);
        this.ship.setRotation(Math.PI / 2);
        // this.cameras.main.shake();
      } else if (this.cursors.D.isDown && this.input.isOver) {
        // this.ship.setAngularVelocity(150);
        this.ship.setVelocityX(200);
        this.ship.setRotation(-Math.PI / 2);
      }
      if (this.cursors.W.isDown && this.input.isOver) {
        // this.physics.velocityFromRotation(this.ship.rotation + 1.5, 100, this.ship.body.acceleration);
        this.ship.setVelocityY(-200);
        this.ship.setRotation(Math.PI);
      } else if (this.cursors.S.isDown && this.input.isOver) {
        this.ship.setVelocityY(200);
        this.ship.setRotation();
      }

      const { x } = this.ship;
      const { y } = this.ship;
      const r = this.ship.rotation;
      // const base = this.ship.base_speed;

      if (this.ship.oldPosition && (x !== this.ship.oldPosition.x || y !== this.ship.oldPosition.y || r !== this.ship.oldPosition.rotation)) {
        if ((x > this.game.canvas.width * MAP_VIEW_MULT || x < 0) && (y > this.game.canvas.height * MAP_VIEW_MULT || y < 0)) {
          this.socket.emit('playerMovement', { x: this.ship.oldPosition.x, y: this.ship.oldPosition.y, rotation: this.ship.rotation });
          // console.log('both');
          this.ship.x = this.ship.oldPosition.x;
          this.ship.y = this.ship.oldPosition.y;
        } else if (x > this.game.canvas.width * MAP_VIEW_MULT || x < 0) {
          // console.log('x cross');
          // console.log(x);
          // console.log(this.game.canvas.width);
          this.socket.emit('playerMovement', { x: this.ship.oldPosition.x, y: this.ship.y, rotation: this.ship.rotation });
          this.ship.x = this.ship.oldPosition.x;
        } else if (y > this.game.canvas.height * MAP_VIEW_MULT || y < 0) {
          // console.log('y cross');
          // console.log(y);
          // console.log(this.game.canvas.height);
          this.socket.emit('playerMovement', { x: this.ship.x, y: this.ship.oldPosition.y, rotation: this.ship.rotation });
          this.ship.y = this.ship.oldPosition.y;
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
