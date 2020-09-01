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
import laserRed from '../assets/laserRed.png';
import laserBlue from '../assets/laserBlue.png';

import shootNoise from '../assets/beam.mp3';
import pickupsound from '../assets/pickup.mp3';
import hitmarker from '../assets/hitmarker.mp3';
// import icepng from '../assets/fonts/bitmap/iceicebaby.png';
// import icexml from '../assets/fonts/bitmap/iceicebaby.xml';

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
    this.load.image('laserRed', laserRed);
    this.load.image('laserBlue', laserBlue);
    this.load.audio('pickup', pickupsound);
    this.load.audio('pewpew', shootNoise);
    this.load.audio('hitmarker', hitmarker);
    // this.load.bitmapFont('ice', '../assets/fonts/bitmap/iceicebaby.png', '../assets/fonts/bitmap/iceicebaby.xml');
  }

  /* Starting template was adapted from phaser intro tutorial at https://phasertutorials.com/creating-a-simple-multiplayer-game-in-phaser-3-with-an-authoritative-server-part-1/ */
  create() {
    let email, username;
    const user = fbase.auth().currentUser;
    email = user.email;
    username = user.displayName;
    console.log(email, username);
    if (username === null) {
      email = 'devonc2000@gmail.com';
      username = 'decheftw';
    }
    if (email === null) {
      email = 'devonc2000@gmail.com';
      username = 'decheftw';
    }
    // this.socket = io('https://touch-the-fire-api.herokuapp.com/');
    this.socket = io('localhost:9090');
    console.log(this.socket);
    this.socket.on('connect', () => { console.log('socket.io connected'); });
    this.socket.emit('isgame', { x: 1 });
    this.minimap = this.cameras.add(0, 0, 150, 150).setZoom(0.1).setName('mini');
    this.minimap.setBackgroundColor('black');
    // eslint-disable-next-line max-len
    this.add.image(this.game.canvas.width * (MAP_VIEW_MULT / 2), this.game.canvas.height * (MAP_VIEW_MULT / 2), 'green').setDisplaySize(this.game.canvas.width * MAP_VIEW_MULT, this.game.canvas.height * MAP_VIEW_MULT);
    this.cameras.main.setBackgroundColor('#086100');
    this.fire = this.physics.add.image(this.game.canvas.width * (MAP_VIEW_MULT / 2), this.game.canvas.height * (MAP_VIEW_MULT / 2) + 20, 'fire').setDisplaySize(50 * 1.8, 65 * 1.8);
    this.lasercolor = 'laserRed';
    this.shootingNoise = this.sound.add('pewpew');
    this.pickupsound = this.sound.add('pickup');
    this.hitmarkersound = this.sound.add('hitmarker');
    this.otherPlayers = this.physics.add.group();
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
    this.cursors = { ...this.input.keyboard.addKeys('W,S,A,D,SPACE,I,J,K,L,ONE,TWO,THREE,FOUR,M') };

    this.socket.on('playerMoved', (playerInfo) => {
      this.otherPlayers.getChildren().forEach((otherPlayer) => {
        if (playerInfo.playerId === otherPlayer.playerId) {
          otherPlayer.setRotation(playerInfo.rotation);
          otherPlayer.setPosition(playerInfo.x, playerInfo.y);
        }
      });
    });
    this.blueScoreText = this.add.text(170, 16, '', { fontSize: '32px', fill: '#0000FF' }).setScrollFactor(0);
    this.countDownText = this.add.text(this.game.canvas.width * 0.5, 16, '', { fontSize: '32px', fill: '#FFFF00', fontFamily: 'Orbitron' }).setScrollFactor(0);
    this.redScoreText = this.add.text(this.game.canvas.width * 0.8, 16, '', { fontSize: '32px', fill: '#FF0000' }).setScrollFactor(0);

    this.socket.on('scoreUpdate', (scores) => {
      this.blueScoreText.setText(`Blue: ${scores.blue}`);
      this.redScoreText.setText(`Red: ${scores.red}`);
    });
    this.pickedupstarone = false;
    this.socket.on('starLocation', (starLocation) => {
      if (this.star) this.star.destroy();
      this.pickedupstarone = false;
      this.star = this.physics.add.image(starLocation.x, starLocation.y, 'money').setDisplaySize(53, 40);
      this.physics.add.overlap(this.ship, this.star, () => {
        if (this.pickedupstarone === false) {
          this.pickedupstarone = true;
          this.pickupsound.play();
          this.socket.emit('starCollected');
          this.dba += 10;
          this.dbatext.setText(`DBA:${this.dba}`);
        }
      });
    });
    this.pickedupstartwo = false;
    this.socket.on('starLocationtwo', (starLocation) => {
      if (this.startwo) this.startwo.destroy();
      this.pickedupstartwo = false;
      this.startwo = this.physics.add.image(starLocation.x, starLocation.y, 'money').setDisplaySize(53, 40);
      this.physics.add.overlap(this.ship, this.startwo, () => {
        if (this.pickedupstartwo === false) {
          this.pickedupstartwo = true;
          this.pickupsound.play();
          this.socket.emit('starCollectedtwo');
          this.dba += 10;
          this.dbatext.setText(`DBA:${this.dba}`);
        }
      });
    });
    this.pickedupkeystone = false;
    this.socket.on('keystoneLocation', (keystoneLocation) => {
      if (this.keystone) this.keystone.destroy();
      this.pickedupkeystone = false;
      this.keystone = this.physics.add.image(keystoneLocation.x, keystoneLocation.y, 'keystone').setDisplaySize(53, 40);
      this.physics.add.overlap(this.ship, this.keystone, () => {
        if (this.pickedupkeystone === false) {
          this.pickedupkeystone = true;
          this.pickupsound.play();
          this.socket.emit('keystoneCollected');
          this.dba += 5;
          this.dbatext.setText(`DBA:${this.dba}`);
          if (this.health < 100) {
            this.health += 15;
            this.healthtext.setText(`Health:${this.health}`);
          }
        }
      });
    });
    this.pickedupkeystonetwo = false;
    this.socket.on('keystoneLocationtwo', (keystoneLocation) => {
      if (this.keystonetwo) this.keystonetwo.destroy();
      this.pickedupkeystonetwo = false;
      this.keystonetwo = this.physics.add.image(keystoneLocation.x, keystoneLocation.y, 'keystone').setDisplaySize(53, 40);
      this.physics.add.overlap(this.ship, this.keystonetwo, () => {
        if (this.pickedupkeystonetwo === false) {
          this.pickedupkeystonetwo = true;
          this.pickupsound.play();
          this.socket.emit('keystoneCollectedtwo');
          this.dba += 5;
          this.dbatext.setText(`DBA:${this.dba}`);
          if (this.health < 100) {
            this.health += 15;
            this.healthtext.setText(`Health:${this.health}`);
          }
        }
      });
    });
    this.bulletdamage = 35;
    this.okoverlap = 0;
    this.switchstate = 0;
    this.fireDuration = [];
    this.firescorethreshold = 0;
    this.game.input.keyboard.clearCaptures();
    this.fired = false;
    this.bulletsfired = 0;
    this.input.keyboard.on('keydown_SPACE', () => {
      if (!this.fired && this.input.isOver) {
        this.fired = !this.fired;
        this.shootingNoise.play();
        this.bulletsfired += 1;
        this.socket.emit('lasershot', {
          laserId: Date.now(),
          initial_x: this.ship.x,
          initial_y: this.ship.y,
          x: this.ship.x,
          y: this.ship.y,
          rotation: this.ship.rotation,
          laser_speed: 15,
          shotfrom: this.socket.id,
          shooter_team: this.ship.team,
          laser_damage: this.bulletdamage,
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
    // eslint-disable-next-line new-cap
    this.hsv = Phaser.Display.Color.HSVColorWheel();
    this.i = 0;
    this.lasers = [];
    this.socket.on('laser-locationchange', (updatedLasers) => {
      updatedLasers.forEach((item, index) => {
        if (this.lasers[index] === undefined && item.shooter_team === 'red') {
          this.lasers[index] = this.add.sprite(item.x, item.y, 'laserRed').setDisplaySize(20, 10);
        } else if (this.lasers[index] === undefined && item.shooter_team === 'blue') {
          this.lasers[index] = this.add.sprite(item.x, item.y, 'laserBlue').setDisplaySize(20, 10);
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

    // rainbow text inspiration from  https://phaser.io/examples/v3/view/display/tint/rainbow-text
    this.gameendtext = this.add.text((this.game.canvas.width / 2), (this.game.canvas.height / 2) - 60, '', { fontSize: '60px', fill: '#fff' }).setOrigin(0.5).setScrollFactor(0);
    this.socket.on('gameover', (data) => {
      try {
        this.gameendtext.setText(`${data.text}`);
      } catch {
        console.log('errorcatchactivated');
        this.socket.emit('forcedisconnect');
      }
      try {
        this.gameendtext.setStroke('#00f', 16);
      } catch {
        console.log('errorcatchactivated');
        this.socket.emit('forcedisconnect');
      }
      try {
        this.gameendtext.setShadow(2, 2, '#333333', 2, true, true);
      } catch {
        console.log('errorcatchactivated');
        this.socket.emit('forcedisconnect');
      }
      let win = 1;
      // eslint-disable-next-line eqeqeq
      if (this.ship.team.localeCompare(data.winner) == 0) {
        win = 1;
      } else { win = 0; }
      console.log(email, username);
      this.socket.emit('leaderboarddata', {
        user: username, em: email, winner: win, bulletsfired: this.bulletsfired, dba: this.dba,
      });
    });

    this.restartin = this.add.text((this.game.canvas.width / 2), (this.game.canvas.height / 2) + 60, '', { fontSize: '55px', fill: '#000' }).setOrigin(0.5).setScrollFactor(0);
    this.restartin.setStroke('#fff', 16);
    // this.restartin.setShadown(2, 2, '#333333', 2, true, true);

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
      this.ship.x = Math.random() * ((this.game.canvas.width * MAP_VIEW_MULT - 50) - 50) + 50;
      this.ship.y = Math.random() * ((this.game.canvas.height * MAP_VIEW_MULT - 50) - 50) + 50;
      this.health = 150;
      this.dba = 0;
      this.bulletsfired = 0;
      this.bulletdamage = 35;
      this.yourhealth = 150;
      this.dbamultiplier = 1;
      this.boughtbulletdamagebool = false;
      this.bought1booltest = false;
      this.bought2booltest = false;
      this.bought3booltest = false;
      this.bought4booltest = false;

      this.boughthealthboostbool = false;
      this.boughtdbaboostbool = false;
      this.boughtcameraheight = false;

      this.minimap.setZoom(0.1);
      try {
        this.healthtext.setText(`Health:${this.health}`);
      } catch {
        console.log('errorcatchactivated');
        this.socket.emit('forcedisconnect');
      }
      this.dbatext.setText(`DBA:${this.dba}`);
      this.socket.emit('playerMovement', { x: this.ship.x, y: this.ship.y, rotation: this.ship.rotation });
    });

    this.yourhealth = 150;
    this.dbamultiplier = 1;
    this.health = this.yourhealth;
    this.dba = 0;
    this.healthtext = this.add.text(16, this.game.canvas.height * 0.9, '', { fontSize: '32px', fill: '#000000' }).setScrollFactor(0);
    this.dbatext = this.add.text(16, this.game.canvas.height * 0.95, '', { fontSize: '32px', fill: '#000000' }).setScrollFactor(0);
    this.healthtext.setText(`Health:${this.health}`);
    this.dbatext.setText(`DBA:${this.dba}`);
    this.lastlasertohit = Date.now();
    this.awayUpdate();
    this.socket.on('hit', (info) => {
      if (info.playerId === this.socket.id) {
        if (this.lastlasertohit !== info.laserId && info.shooter_team !== this.ship.team) {
          this.health -= info.laser_damage;
          this.healthtext.setText(`Health:${this.health}`);
          this.lastlasertohit = info.laserId;
          this.ship.setAlpha(0.3);
        }
        console.log(this.health);
      } else {
        this.otherPlayers.getChildren().forEach((player) => {
          if (this.lastlasertohit !== info.laserId && player.playerId === info.playerId && player.team !== this.ship.team) {
            player.setAlpha(0.3);
            this.hitmarkersound.play();
            this.dba += 5 * this.dbamultiplier;
            this.dbatext.setText(`DBA:${this.dba}`);
            this.lastlasertohit = info.laserId;
          }
        });
      }
    });

    this.boughttext = this.add.text((this.game.canvas.width / 2), (this.game.canvas.height / 2) - 60, '', { fontSize: '38px', fill: '#fff' }).setOrigin(0.5).setScrollFactor(0);
    this.notenoughmoney = this.add.text((this.game.canvas.width / 2), (this.game.canvas.height / 2) - 60, '', { fontSize: '60px', fill: '#fff' }).setOrigin(0.5).setScrollFactor(0);
    this.boughtbulletdamagebool = false;
    this.boughthealthboostbool = false;
    this.boughtdbaboostbool = false;
    this.boughtcameraheight = false;
    this.kickedforinactivity = this.add.text((this.game.canvas.width / 2), (this.game.canvas.height / 2) - 60, '', { fontSize: '35px', fill: '#fff' }).setOrigin(0.5).setScrollFactor(0);
    this.socket.on('kicked', () => {
      this.kickedforinactivity.setText('Kicked for inactivity, refresh to rejoin');
      setTimeout(() => {
        window.location.href = '/';
      }, 3000);
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
      this.lasercolor = 'laserBlue';
      // this.ship = this.physics.add.image(playerInfo.x, playerInfo.y, 'blueplayer').setOrigin(0.5, 0.5).setDisplaySize(65, 40);
      // this.anims.create({
      //   key: 'move',
      //   frames: this.anims.generateFrameNumbers('blueplayer', { start: 0, end: 4 }),
      //   frameRate: 5,
      //   repeat: -1,
      // });
    } else {
      this.lasercolor = 'laserRed';
      this.ship = this.physics.add.image(playerInfo.x, playerInfo.y, 'redplayer').setOrigin(0.5, 0.5).setDisplaySize(65, 40);
    }

    this.ship.team = playerInfo.team;
    this.cameras.main.startFollow(this.ship);
    this.minimap.startFollow(this.ship);
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
    if (this.health <= 0) {
      this.ship.x = Math.random() * ((this.game.canvas.width * MAP_VIEW_MULT - 50) - 50) + 50;
      this.ship.y = Math.random() * ((this.game.canvas.height * MAP_VIEW_MULT - 50) - 50) + 50;
      this.health = this.yourhealth;
      this.healthtext.setText(`Health:${this.health}`);
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
    if (this.cursors.M.isDown && this.toggle === true && this.input.isOver) {
      this.toggle = false;
      this.game.sound.mute = !this.game.sound.mute;
    } else if (this.cursors.M.isUp && this.input.isOver) {
      this.toggle = true;
    }
    if (this.ship) {
      this.boughttext.setText('');
      this.notenoughmoney.setText('');

      // This chunk of code is to bypass update refresh rate to enable bought/already bought center texts
      if (this.cursors.ONE.isUp) {
        this.bought1booltest = false;
      }
      if (this.cursors.TWO.isUp) {
        this.bought2booltest = false;
      }
      if (this.cursors.THREE.isUp) {
        this.bought3booltest = false;
      }
      if (this.cursors.FOUR.isUp) {
        this.bought4booltest = false;
      }

      if (this.cursors.ONE.isDown && this.boughtbulletdamagebool) {
        if (!this.bought1booltest) {
          this.boughttext.setText('Already purchased Extra Bullet Damage');
        } else {
          this.boughttext.setText('Bought Extra Bullet Damage');
        }
      }

      if (this.cursors.TWO.isDown && this.boughthealthboostbool) {
        if (!this.bought2booltest) {
          this.boughttext.setText('Already purchased Increased Health');
        } else {
          this.boughttext.setText('Bought Increased Health');
        }
      }

      if (this.cursors.THREE.isDown && this.boughtdbaboostbool) {
        if (!this.bought3booltest) {
          this.boughttext.setText('Already purchased Extra DBA Per Hit');
        } else {
          this.boughttext.setText('Bought Extra DBA Per Hit');
        }
      }

      if (this.cursors.FOUR.isDown && this.boughtcameraheight) {
        if (!this.bought4booltest) {
          this.boughttext.setText('Already purchased Expanded Minimap');
        } else {
          this.boughttext.setText('Bought Expanded Minimap');
        }
      }

      if ((this.cursors.ONE.isDown && this.dba >= 250) && !this.boughtbulletdamagebool) {
        this.bulletdamage = 50;
        if (this.cursors.ONE.isDown) {
          this.boughttext.setText('Bought Extra Bullet Damage');
        }
        if (this.boughtbulletdamagebool === false) {
          this.boughtbulletdamagebool = true;
          this.bought1booltest = true;
          this.dba -= 250;
          console.log(this.dba);
          this.dbatext.setText(`DBA:${this.dba}`);
        }
      } else if (this.cursors.ONE.isDown && this.dba <= 250 && this.boughtbulletdamagebool === false) {
        this.notenoughmoney.setText('Not enough DBA');
      }
      if ((this.cursors.TWO.isDown && this.dba >= 270) && !this.boughthealthboostbool) {
        this.yourhealth = 180;
        if (this.cursors.TWO.isDown) {
          this.boughttext.setText('Bought Increased Health');
        }
        if (this.boughthealthboostbool === false) {
          this.boughthealthboostbool = true;
          this.bought2booltest = true;
          this.dba -= 270;
          this.health = this.yourhealth;
          this.dbatext.setText(`DBA:${this.dba}`);
          this.healthtext.setText(`Health:${this.health}`);
        }
      } else if (this.cursors.TWO.isDown && this.dba <= 270 && this.boughthealthboostbool === false) {
        this.notenoughmoney.setText('Not enough DBA');
      }
      if ((this.cursors.THREE.isDown && this.dba >= 300) && !this.boughtdbaboostbool) {
        this.dbamultiplier = 2;
        if (this.cursors.THREE.isDown) {
          this.boughttext.setText('Bought Extra DBA Per Hit');
        }
        if (this.boughtdbaboostbool === false) {
          this.boughtdbaboostbool = true;
          this.bought3booltest = true;

          this.dba -= 300;
          this.dbatext.setText(`DBA:${this.dba}`);
        }
      } else if (this.cursors.THREE.isDown && this.dba <= 300 && this.boughtdbaboostbool === false) {
        this.notenoughmoney.setText('Not enough DBA');
      }
      if ((this.cursors.FOUR.isDown && this.dba >= 350) && !this.boughtcameraheight) {
        this.minimap.setZoom(0.08);
        if (this.cursors.FOUR.isDown) {
          this.boughttext.setText('Bought Expanded Minimap');
        }
        if (this.boughtcameraheight === false) {
          this.boughtcameraheight = true;
          this.bought4booltest = true;
          this.dba -= 350;
          this.dbatext.setText(`DBA:${this.dba}`);
        }
      } else if (this.cursors.FOUR.isDown && this.dba <= 350 && this.boughtcameraheight === false) {
        this.notenoughmoney.setText('Not enough DBA');
      }
      if (this.health <= 0) {
        this.ship.x = Math.random() * ((this.game.canvas.width * MAP_VIEW_MULT - 50) - 50) + 50;
        this.ship.y = Math.random() * ((this.game.canvas.height * MAP_VIEW_MULT - 50) - 50) + 50;
        this.health = this.yourhealth;
        this.healthtext.setText(`Health:${this.health}`);
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
    const top = this.hsv[this.i].color;
    const bottom = this.hsv[359 - this.i].color;

    this.gameendtext.setTint(top, top, bottom, bottom);
    this.gameendtext.setTint(top, bottom, top, bottom);

    this.i += 1;

    if (this.i === 360) {
      this.i = 0;
    }
  }
}

export default GameScene;
