import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class Instructions extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div id="instructions-page">
        <div id="instructions-wrapper">
          <div><h1>How to Play</h1></div>
          <div><h2>Basics</h2></div>
          <div>
            <p>
              TouchTheFire is a game with up to 6 players split into 2 teams - red and blue. The goal of each team is to amass as many points as possible.
              Points can be scored by touching the fire in the center of the map. The more players on your team that are touching the fire at once, the faster you score points.
              You can send players of the opposite team back to the outskirts of the Green by hitting them with your projectiles.
              The team with the most points after 3 minutes wins the round!
            </p>
          </div>
          <div><h2>More Features</h2></div>
          <div>
            <p>
              Powerups grant players special abilities and can be acquired by collecting DBA.
              DBA can be collected by picking up the money and blue cans on the ground or hitting other players with your projectiles.
              Picking up the blue cans also restores a small amount of health to the player.
            </p>
          </div>
          <div><h2>Basic Controls</h2></div>
          <div className="controls-list">
            <div>Up: W</div>
            <div>Left: A</div>
            <div>Down: S</div>
            <div>Right: D</div>
            <div>Shoot: SPACE</div>
            <div>Mute: M</div>
          </div>
          <div><h2>Rotation Controls</h2></div>
          <div className="controls-list">
            <div>Rotate Left: J</div>
            <div>Rotate Right: L</div>
            <div>Forward: I</div>
            <div>Shoot: SPACE</div>
          </div>
          <div><h2>Powerups</h2></div>
          <div className="controls-list">
            <div>
              Key 1: Increased Bullet Damage
            </div>
            <div>
              Key 2: Increased Health
            </div>
            <div>
              Key 3: Extra DBA per Shot Hit
            </div>
            <div>
              Key 4: Extra Zoomed Minimap
            </div>
          </div>
          <div><NavLink to="/"><button type="button" className="button-var3">Back</button></NavLink></div>
        </div>
      </div>
    );
  }
}

export default Instructions;
