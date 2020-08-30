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
    this.generateLeaderboardDBA = this.generateLeaderboardDBA.bind(this);
    this.generateLeaderboardWins = this.generateLeaderboardWins.bind(this);
    this.generateLeaderboardShots = this.generateLeaderboardShots.bind(this);

    this.state = {
      users: Map(),
      leaderboard: null,
    };
  }

  componentDidMount = () => {
    this.initialize();
    this.generateLeaderboardWins();
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

  sortWin() {
    const array = [];
    // eslint-disable-next-line consistent-return
    console.log(this.state.users);
    this.state.users.entrySeq().forEach((element) => {
      let i = 0;
      if (array.length == 0) {
        array.push([element[1].username, element[1].wins]);
        i += 1;
      }
      while (i < array.length) {
        console.log([element[1].wins, array[i][1]]);
        if (element[1].wins >= array[i][1]) {
          array.splice(i, 0, [element[1].username, element[1].wins]);
          break;
        } else {
          i += 1;
          if (i == array.length) {
            array.push([element[1].username, element[1].wins]);
          }
        }
      }
    });
    console.log(array);
    return array;
  }

  sortdba() {
    const array = [];
    // eslint-disable-next-line consistent-return
    console.log(this.state.users);
    this.state.users.entrySeq().forEach((element) => {
      let i = 0;
      if (array.length == 0) {
        array.push([element[1].username, element[1].dba]);
        i += 1;
      }
      while (i < array.length) {
        console.log([element[1].dba, array[i][1]]);
        if (element[1].dba >= array[i][1]) {
          array.splice(i, 0, [element[1].username, element[1].dba]);
          console.log(array);
          break;
        } else {
          i += 1;
          console.log(i, array.length);
          if (i == array.length) {
            array.push([element[1].username, element[1].dba]);
          }
        }
      }
    });
    console.log(array);
    return array;
  }

  sortshots() {
    const array = [];
    // eslint-disable-next-line consistent-return
    console.log(this.state.users);
    this.state.users.entrySeq().forEach((element) => {
      let i = 0;
      if (array.length == 0) {
        array.push([element[1].username, element[1].shots]);
        i += 1;
      }
      while (i < array.length) {
        console.log([element[1].shots, array[i][1]]);
        if (element[1].shots >= array[i][1]) {
          array.splice(i, 0, [element[1].username, element[1].shots]);
          break;
        } else {
          i += 1;
          if (i == array.length) {
            array.push([element[1].username, element[1].shots]);
          }
        }
      }
    });
    console.log(array);
    return array;
  }

  generateLeaderboardWins() {
    if (this.state.users.size > 0) {
      let i = 0;
      const entries = this.sortWin().map((element) => {
        i += 1;
        return <Entry key={i} rank={i} username={element[0]} score={element[1]} />;
      });
      console.log(entries);
      this.setState({ leaderboard: entries });
    }
    return null;
  }

  generateLeaderboardDBA() {
    if (this.state.users.size > 0) {
      let i = 0;
      const entries = this.sortdba().map((element) => {
        i += 1;
        return <Entry key={i} rank={i} username={element[0]} score={element[1]} />;
      });
      console.log(entries);
      this.setState({ leaderboard: entries });
    }
    return null;
  }

  generateLeaderboardShots() {
    if (this.state.users.size > 0) {
      let i = 0;
      const entries = this.sortshots().map((element) => {
        i += 1;
        return <Entry key={i} rank={i} username={element[0]} score={element[1]} />;
      });
      console.log(entries);
      this.setState({ leaderboard: entries });
    }
    return null;
  }

  render() {
    console.log(this.state.leaderboard);
    return (
      <div id="lb-page">
        <div id="lb-title">
          <h1>Leaderboard</h1>
        </div>
        <div id="lb_buttons">
          <p onClick={this.generateLeaderboardDBA}>DBA</p>
          <p onClick={this.generateLeaderboardWins}>Wins</p>
          <p onClick={this.generateLeaderboardShots}>Shots Fired</p>
        </div>
        <div id="leaderboard-top">
          {this.state.leaderboard}
        </div>
      </div>
    );
  }
}

export default Leaderboard;
