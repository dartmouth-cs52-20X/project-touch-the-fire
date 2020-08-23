/* eslint-disable no-param-reassign */
/* eslint-disable react/no-unused-state */
/* eslint-disable new-cap */
/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import { Map } from 'immutable';
import firebase from 'firebase';
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
    const database = firebase.database().ref('user');
    database.on('value', (snapshot) => {
      const newUserState = snapshot.val();
      this.setState({ users: Map(newUserState) });
    }, (error) => {
      console.error(error);
    });
  }

  findLargest(array) {
    let largest = this.state.users.toIndexedSeq().get(0);
    let score = 0;
    // eslint-disable-next-line consistent-return
    this.state.users.entrySeq().forEach((element) => {
      if (array.includes([element, element.score])) { return null; }
      if (element.score > largest.score) {
        largest = element;
        score = element.score;
        element.score = -1;
      }
    });
    return [largest.username, score];
  }

  topN(n) {
    if (this.state.users.size < n) { n = this.state.users.size; }
    let i = 0;
    const leaderboard = [];
    while (i < n) {
      leaderboard.push(this.findLargest(leaderboard));
      i += 1;
    }
    return leaderboard;
  }

  generateLeaderboard(n) {
    if (this.state.users.size > 0) {
      let i = 0;
      const entries = this.topN(n).map((element) => {
        i += 1;
        return <Entry rank={i} username={element[0]} score={element[1]} />;
      });
      console.log(entries);
      return entries;
    }
    return null;
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
