/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { Component } from 'react';
import $ from 'jquery';
import bullet from '../assets/pu_bullet.png';
import health from '../assets/pu_health.png';
import map from '../assets/pu_map.png';
import money from '../assets/pu_money.png';

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
              <img id="key1" src={bullet} alt="250 DBA: Press 1 for Increased Bullet Damage" />
            </div>
            <div className="powerup-item" onClick={() => this.onPowerUp($('#key2').attr('alt'))}>
              <img id="key2" src={health} alt="270 DBA: Press 2 for Increased Health" />
            </div>
            <div className="powerup-item" onClick={() => this.onPowerUp($('#key3').attr('alt'))}>
              <img id="key3" src={money} alt="300 DBA: Press 3 for Extra DBA Per Hit" />
            </div>
            <div className="powerup-item" onClick={() => this.onPowerUp($('#key4').attr('alt'))}>
              <img id="key4" src={map} alt="350 DBA: Press 4 for Extra Zoomed Minimap" />
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
