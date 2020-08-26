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
        <div><h1>How to Play</h1></div>
        <div><h2>Basics</h2></div>
        <div>
          <p>
            TouchTheFire is a game with 6 players split into 2 teams of 3. The goal of each team is to amass as many points as possible.
            For every second that your team has a player touching the fire, you score a point.
            You can send players back to the outskirts of the Green by hitting them with your projectiles.
            Powerups are scattered across the map and grant players special abilities.
            The first team to X points, or the team with the most points after 3 minutes, wins!
          </p>
        </div>
        <div><h2>Basic Controls</h2></div>
        <div className="controls-list">
          <div>Up: W</div>
          <div>Left: A</div>
          <div>Down: S</div>
          <div>Right: D</div>
          <div>Shoot: SPACE</div>
        </div>
        <div><h2>Advanced Controls</h2></div>
        <div className="controls-list">
          <div>Rotate Left: J</div>
          <div>Rotate Right: L</div>
          <div>Forward: I</div>
          <div>Shoot: SPACE</div>
        </div>
        <div><h2>Powerups</h2></div>
        <div>
          <p>
            FILL IN POWERUPS HERE
          </p>
        </div>
        <div><NavLink to="/"><button type="button" className="button-var1">Back</button></NavLink></div>
      </div>
    );
  }
}

export default Instructions;
