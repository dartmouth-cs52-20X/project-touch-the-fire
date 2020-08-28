/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import $ from 'jquery';
import keystone from '../assets/keystone.png';

class PowerUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      clicked: 'Click to See Available Power Ups',
    };
  }

  onPowerUp(imgAttr) {
    this.setState({ clicked: imgAttr });
  }

  renderPowerMenu() {
    return (
      <div className="power-up-menu">
        <div><h1>Power Up Menu</h1></div>
        <div><h3>{this.state.clicked}</h3></div>
        <div className="power-up-menu-desc" />
        <div className="power-up-items">
          <div className="powerup-row">
            <div className="powerup-item" onClick={() => this.onPowerUp($('#key1').attr('alt'))}>
              <img id="key1" src={keystone} alt="150 coins: Press 1 for Speed Boost" />
            </div>
            <div className="powerup-item" onClick={() => this.onPowerUp($('#key2').attr('alt'))}>
              <img id="key2" src={keystone} alt="250 coins: Press 2 for Bullet Range Boost" />
            </div>
            <div className="powerup-item" onClick={() => this.onPowerUp($('#key3').attr('alt'))}>
              <img id="key3" src={keystone} alt="200 coins: Press 3 for Bullet Power Boost" />
            </div>
            <div className="powerup-item" onClick={() => this.onPowerUp($('#key4').attr('alt'))}>
              <img id="key4" src={keystone} alt="100 coins: Press 4 for Bullet Speed Boost" />
            </div>
          </div>
          <div className="powerup-row">
            <div className="powerup-item" onClick={() => this.onPowerUp($('#key5').attr('alt'))}>
              <img id="key5" src={keystone} alt="125 coins: Press 5 for Health Boost" />
            </div>
            <div className="powerup-item" onClick={() => this.onPowerUp($('#key6').attr('alt'))}>
              <img id="key6" src={keystone} alt="175 coins: Press 6 for 2x Fire Point Boost" />
            </div>
            <div className="powerup-item" onClick={() => this.onPowerUp($('#key7').attr('alt'))}>
              <img id="key7" src={keystone} alt="150 coins: Press 7 for Bigger Camera Area" />
            </div>
            <div className="powerup-item" onClick={() => this.onPowerUp($('#key8').attr('alt'))}>
              <img id="key8" src={keystone} alt="100 coins: Press 8 for Turning Speed Boost" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className="power-up-menu-container">
        {this.renderPowerMenu()}
      </div>
    );
  }
}

export default PowerUp;
