/* eslint-disable eqeqeq */
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

  sort(array) {
    // eslint-disable-next-line consistent-return
    console.log(this.state.users);
    this.state.users.entrySeq().forEach((element) => {
      let i = 0;
      if (array.length == 0) {
        array.push([element[1].username, element[1].score]);
      }
      while (i < array.length) {
        console.log([element[1].score, array[i][1]]);
        if (element[1].score >= array[i][1]) {
          array.splice(i, 0, [element[1].username, element[1].score]);
          break;
        } else {
          i += 1;
          if (i == array.size) {
            array.push([element[1].username, element[1].score]);
          }
        }
      }
    });
  }

  topN() {
    const leaderboard = [];
    this.sort(leaderboard);
    return leaderboard;
  }

  generateLeaderboard() {
    if (this.state.users.size > 0) {
      let i = 0;
      const entries = this.topN().map((element) => {
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
        {this.generateLeaderboard()}
      </div>
    );
  }
}

export default Leaderboard;
