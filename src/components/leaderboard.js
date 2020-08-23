/* eslint-disable no-param-reassign */
/* eslint-disable react/no-unused-state */
/* eslint-disable new-cap */
/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import { Map } from 'immutable';
import fbase from '../config/fire';
import Entry from './leaderboard_entry';

class Leaderboard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: Map(),
    };
  }

  componentDidMount = () => {
    this.initialize();
  }

  initialize() {
    fbase.on('value', (snapshot) => {
      const newUserState = snapshot.val();
      this.setState({ users: Map(newUserState) });
    }, (error) => {
      console.error(error);
    });
  }

  findLargest() {
    let largest = this.users.toIndexedSeq().get(0);
    let score = 0;
    this.users.entrySeq().forEach((element) => {
      if (element.score > largest.score) {
        largest = element;
        score = element.score;
        element.score = -1;
      }
    });
    return [largest.username, score];
  }

  topN(n) {
    let i = 0;
    const leaderboard = [];
    this.initialize();
    while (i < n) {
      leaderboard.push(this.findLargest);
      i += 1;
    }
    return leaderboard;
  }

  generateLeaderboard(n) {
    let i = 0;
    const entries = this.topN(n).forEach((element) => {
      i += 1;
      return <Entry rank={i} username={element[0]} score={element[1]} />;
    });
    return entries;
  }

  render() {
    return (
      <div>
        {this.generateLeaderboard(5)}
      </div>
    );
  }
}

export default Leaderboard;
